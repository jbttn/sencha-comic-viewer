<?php

  //$path = !empty($_REQUEST['path']) ? $_REQUEST['path'] : '/mnt/merged/Downloads/';
  //$path = isset($_REQUEST['node']) ? $_REQUEST['node'] : '/mnt/merged/Downloads/';
  $path = $_REQUEST['node'];
  if($path == "root") {
    $path = "/mnt/merged/Downloads/";
  }

  $pathinfo = pathinfo($path);

  $file = $_REQUEST['file'];

  $data = array();

  function cmp($a, $b) {
    return strcmp($a['label'], $b['label']);
  }

  function open_zip($path, $file) {
    $zip = new ZipArchive;
    $ret = array();
    $ret2 = array();
    //echo "{$path}/{$file}";
    if ($zip->open("{$path}/{$file}")) { 
      for($i = 0; $i < $zip->numFiles; $i++) {
        $ret[] = array(
          'label' => basename($zip->getNameIndex($i)),
          'name' => $zip->getNameIndex($i),
          'path' => $path,
          'file' => $file,
          'type' => 'image',
          'leaf' => 'true'
        );
      }
      uasort($ret, 'cmp');
      /* uasort screwes up the structure of the array so we must recopy */
      foreach($ret as $r)
      {
        $ret2[] = $r;
      }
      //print_r($ret2);
      return $ret2;
    } else { 
      //echo "Failed to open CBZ / ZIP file..."; 
    }
  }

  //if(!$file) {
  if(strstr($pathinfo['basename'], '.') == false && $pathinfo['extension'] == '') {
    if(is_dir($path))
    {
      chdir($path);
      $items = scandir($path);
      if($items)
      {
        foreach($items as $item)
        {
          if($item == '.' || $item == '..') continue;
          $path_info = pathinfo($item);
          if(is_dir($item))
          {
            //array_push($data['dir'], realpath($item));
            $data[] = array(
              'label' => basename($item),
              'name' => basename($item),
              'path' => realpath($item),
              'file' => $file,
              'type' => 'dir',
              //'leaf' => 'true'
            );
          } else {
            //array_push($data['file'], $item);
            if(($path_info['extension'] == 'zip') ||
               ($path_info['extension'] == 'rar') ||
               ($path_info['extension'] == 'cbz') ||
               ($path_info['extension'] == 'cbr')) {
              $data[] = array(
                'label' => $item,
                'name' => $item,
                //'path' => $path,
                'path' => realpath($item),
                'file' => $file,
                'type' => $path_info['extension'],
                //'leaf' => 'true'
              );
            } else {
              $data[] = array(
                'label' => $item,
                'name' => $item,
                'path' => realpath($item),
                'file' => $file,
                'type' => 'file',
                'leaf' => 'true'
              );
            }
          }
        }
      }
    }
  } else {
    //$data = open_zip($path, $file);
    $data = open_zip($pathinfo['dirname'], $pathinfo['basename']);
  }

  $json_packet = array(
    "text" => $path,
    "data" => $data
  );

  echo json_encode($json_packet);
?>