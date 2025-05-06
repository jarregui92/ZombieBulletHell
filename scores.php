<?php
session_start();
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'none\'; script-src \'self\'');
header('Cache-Control: no-store, no-cache, must-revalidate');

// Asegurarse de que no haya salida antes de los headers
ob_start();

const SCORES_FILE = __DIR__ . '/scores.json';
const MAX_REQUESTS_PER_MINUTE = 30;
const REQUEST_TIMEOUT = 60;

function ensureScoresFile() {
    if (!file_exists(SCORES_FILE)) {
        file_put_contents(SCORES_FILE, json_encode(['scores' => []]));
    }
}

function isRateLimited($ip) {
    $cacheFile = sys_get_temp_dir() . '/rate_' . md5($ip);
    $requests = [];
    
    if (file_exists($cacheFile)) {
        $requests = unserialize(file_get_contents($cacheFile));
        $requests = array_filter($requests, fn($time) => $time > time() - REQUEST_TIMEOUT);
    }
    
    $requests[] = time();
    file_put_contents($cacheFile, serialize($requests));
    
    return count($requests) > MAX_REQUESTS_PER_MINUTE;
}

function validateScore($data) {
    if (!isset($data['name'], $data['score'], $data['time'], $data['date'])) return false;
    if (!preg_match('/^[A-Z]{1,3}$/', $data['name'])) return false;
    if (!is_numeric($data['score']) || $data['score'] < 0 || $data['score'] > 999999) return false;
    if (!is_numeric($data['time']) || $data['time'] < 0 || $data['time'] > 3600) return false;
    if (!strtotime($data['date'])) return false;
    return true;
}

function secureFileOperation($file, $operation, $data = null) {
    $lock = fopen($file . '.lock', 'w+');
    if (!flock($lock, LOCK_EX)) {
        throw new Exception('No se pudo obtener el bloqueo del archivo');
    }
    
    try {
        if ($operation === 'read') {
            $content = file_get_contents($file);
            if ($content === false) throw new Exception('Error al leer el archivo');
            return $content;
        } else if ($operation === 'write') {
            if (file_put_contents($file, $data) === false) {
                throw new Exception('Error al escribir el archivo');
            }
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

try {
    ensureScoresFile();
    
    if (isRateLimited($_SERVER['REMOTE_ADDR'])) {
        http_response_code(429);
        echo json_encode(['error' => 'Demasiadas solicitudes']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $content = file_get_contents(SCORES_FILE);
        if ($content === false) {
            throw new Exception('Error al leer scores.json');
        }
        
        $scores = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Error al decodificar JSON');
        }
        
        // Asegurarse que exista la clave 'scores'
        if (!isset($scores['scores'])) {
            echo json_encode([]);
            exit;
        }
        
        // Ordenar por puntuación
        usort($scores['scores'], function($a, $b) {
            return $b['score'] - $a['score'];
        });
        
        echo json_encode($scores['scores']);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents('php://input');
        if (strlen($input) > 1024) {
            throw new Exception('Payload demasiado grande');
        }
        
        $data = json_decode($input, true);
        
        if (!validateScore($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos']);
            exit;
        }

        $content = secureFileOperation(SCORES_FILE, 'read');
        $scores = json_decode($content, true);
        
        $scores['scores'][] = [
            'name' => substr(htmlspecialchars($data['name']), 0, 3),
            'score' => min((int)$data['score'], 999999),
            'time' => min((int)$data['time'], 3600),
            'date' => date('c', strtotime($data['date']))
        ];

        usort($scores['scores'], function($a, $b) {
            return $b['score'] - $a['score'];
        });
        $scores['scores'] = array_slice($scores['scores'], 0, 3);

        secureFileOperation(SCORES_FILE, 'write', json_encode($scores, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}

ob_end_flush();