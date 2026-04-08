<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
$ordersFile = $dataDir . '/orders.json';

// Create data directory if it doesn't exist
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize orders file if it doesn't exist
if (!file_exists($ordersFile)) {
    file_put_contents($ordersFile, json_encode([]));
}

// Read orders from file
function readOrders() {
    global $ordersFile;
    $content = file_get_contents($ordersFile);
    return json_decode($content, true) ?: [];
}

// Write orders to file
function writeOrders($orders) {
    global $ordersFile;
    file_put_contents($ordersFile, json_encode($orders, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Return all orders
        echo json_encode(readOrders());
        break;

    case 'POST':
        // Add a new order
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid order data']);
            break;
        }
        $orders = readOrders();
        $orders[] = $input;
        writeOrders($orders);
        echo json_encode(['success' => true, 'id' => $input['id']]);
        break;

    case 'PUT':
        // Update order status
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['id']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id or status']);
            break;
        }
        $orders = readOrders();
        $found = false;
        foreach ($orders as &$order) {
            if ($order['id'] === $input['id']) {
                $order['status'] = $input['status'];
                $found = true;
                break;
            }
        }
        if ($found) {
            writeOrders($orders);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
