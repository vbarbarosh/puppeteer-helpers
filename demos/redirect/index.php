<?php

switch ($_GET['q'] ?? 0) {
case 0:
    header('HTTP/1.1 301');
    header('Location: ?q=1');
    break;
case 1:
    header('HTTP/1.1 301');
    header('Location: ?q=2');
    break;
case 2:
    header('HTTP/1.1 301');
    header('Location: ?q=3');
    break;
case 3:
    header('HTTP/1.1 301');
    header('Location: https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js');
    break;
}
