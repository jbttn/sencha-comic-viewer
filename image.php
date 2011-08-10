<?php
  session_start(); 

  $img = $_GET['img'];
  $sel = $_GET['sel'];
  $path = $_GET['path'];
  $w = $_GET['w'];
  $h = $_GET['h'];
  $q = $_GET['q'];

  $im = imagecreatefromjpeg("zip://{$path}/{$sel}#" . $img);

  $old_x = imageSX($im);
  $old_y = imageSY($im);

  // http://dtbaker.com.au/random-bits/how-to-cache-images-generated-by-php.html
  header("Cache-Control: public, max-age=10800, pre-check=10800");
  header("Pragma: private");
  header("Expires: " . date(DATE_RFC822, strtotime(" 2 day")));
  if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE']))
  {
    header('Last-Modified: ' . $_SERVER['HTTP_IF_MODIFIED_SINCE'], true, 304);
    exit;
  }

  header("Content-type: image/jpeg");
  if($q != "f")
  {
    $thumb = ImageCreateTrueColor($w, $h);
    imagecopyresized($thumb, $im, 0, 0, 0, 0, $w, $h, $old_x, $old_y);
    imagejpeg($thumb, NULL, $q);
    imagedestroy($thumb);
  } else {
    imagejpeg($im);
    imagedestroy($im);
  }
?>