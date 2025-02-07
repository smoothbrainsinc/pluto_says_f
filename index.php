<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
<?php
$clantag = "#YLVGPU9J";$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjQ0ODFiZjZiLWRhOGQtNDJlYy04MWE2LWRhMTAwNDc3NTRiYSIsImlhdCI6MTcxMzk4NTQ1Nywic3ViIjoiZGV2ZWxvcGVyL2EyMjMyYjI2LWRkNGUtOTc0ZC03N2M2LWU1NDhkYzM2YmU0NyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE3NC4yMjkuMTg2LjI3Il0sInR5cGUiOiJjbGllbnQifV19.LAIeNqZF8LMQkuq44CNVurBdhPDu7NVBAL0rNwo-DmZgbzxQf9SzC4ACx6Dbw_Za8iVFSUcWpRkno1n9R2_yWw";$url = "https://api.clashofclans.com/v1/clans/" . urlencode($clantag);$ch = curl_init($url);$headr = array();
$headr[] = "Accept: application/json";
$headr[] = "Authorization: Bearer ".$token;curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);$res = curl_exec($ch);
$data = json_decode($res, true);
curl_close($ch);if (isset($data["reason"])) {
  $errormsg = true;
}$members = $data["memberList"];?>
  <title><?php echo $data["name"]; ?></title><style>
    body {
      font-family: Arial, Helvetica, sans-serif;
    }
    table {
  border-collapse: collapse;
  width: 100%;
  border-radius: 10px;
  border-color: transparent;
}
  table.memberstable tr td {
    border-radius: 5px;
    border-color: transparent;   
  }
th, td {
  text-align: left;
  padding: 8px;
  
}
    table.clantable {
      border-collapse: separate;
      border-spacing: 0px;
      width:100%;
    }
    table.clantable tr td {
      background-color: #aaa;
    }
    table.clantable tr:first-child td:nth-child(3n+1) {
      padding: 10px 20px;
      vertical-align: top;
    }
    table.clantable tr:first-child td:first-child {
      text-align: center;
    }
    /*table.clantable tr:first-child td:last-child {
      width: 20em;
    }*/
    tr:hover {background-color: #f5f5f5;}
    table.clantable tr:first-child td:nth-child(2) {
      color: #e3cfb5;
      font-size: 2em;
      font-weight: bold;
      text-shadow: 1px 1px 0px #000, -1px 1px 0px #000, 1px -1px 0px #000, -1px -1px 0px #000 ;
      padding-top: 5px;
      white-space: nowrap;
      text-align: left;
      padding-right: 50px;
      vertical-align: bottom;
    }
    table.clantable tr:first-child td:nth-child(3) {
      color: #4c4c4c;
      font-size: 1em;
      font-weight: bold;
      padding-top: 5px;
      white-space: nowrap;
      text-align: right;
      padding-left: 50px;
      vertical-align: bottom;
    }
    table.clantable tr:nth-child(1n+2) td {
      border-bottom: solid #000 1px;
      color: #fff;
      font-size: 1em;
      font-weight: bold;
      text-shadow: 1px 1px 0px #000;
      padding-top: 5px;
      white-space: nowrap;
    }
    table.clantable tr:nth-child(1n+2) td:first-child {
      text-align: left;
      padding-right: 50px;
    }
    table.clantable tr:nth-child(1n+2) td:last-child {
      text-align: right;
      padding-left: 50px;
    }
    table.clantable tr:first-child > td:first-child {
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }
    table.clantable tr:first-child > td:last-child {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
    }
    table.clantable .clanlevel {
      color: #fff;
      font-size: 1em;
      font-weight: bold;
      background-color: #000;
      padding: 3px;
    }
    tr:nth-child(even){background-color: #f2f2f2}
  </style>
</head>
<body>
<?php
  if (isset($errormsg)) {
    echo "<p>", "Failed: ", $data["reason"], " : ", isset($data["message"]) ? $data["message"] : "", "</p></body></html>";
    exit;
  }
?>
   <table class="clantable">
    <tr>
      <td rowspan="11"><br/><img src="<?php echo $data["badgeUrls"]["medium"]; ?>" alt="<?php echo $data["name"]; ?>"/></td>
      <td><?php echo $data["name"]; ?></td><td><?php echo $data["tag"]; ?></td>
      <td rowspan="11"><?php echo $data["description"]; ?></td>
    </tr>
    <tr>
      <td>Total points</td><td><?php echo $data["clanPoints"]; ?></td>
    </tr>
    <tr>
      <td>Wars won</td><td><?php echo $data["warWins"]; ?></td>
    </tr>
    <tr>
      <td>War win streak</td><td><?php echo $data["warWinStreak"]; ?></td>
    </tr>
    <!-- <tr>
      <td>Wars drawn</td><td><?php echo $data["warTies"]; ?></td>
    </tr>
    <tr>
      <td>Wars lost</td><td><?php echo $data["warLosses"]; ?></td>
    </tr> -->
    <tr>
      <td>Members</td><td><?php echo $data["members"]; ?>/50</td>
    </tr>
    <tr>
      <td>Type</td><td><?php echo $data["type"]; ?></td>
    </tr>
    <tr>
      <td>Required trophies</td><td><?php echo $data["requiredTrophies"]; ?></td>
    </tr>
    <tr>
      <td>War frequency</td><td><?php echo $data["warFrequency"]; ?></td>
    </tr>
    <tr>
      <td>Clan location</td><td><?php echo $data["location"]["name"]; ?></td>
    </tr>
  </table>
  <table class="memberstable" border="1">
<?php
  foreach ($members as $member) {
?>
    <tr>
      <td style="width: 1cm;"><?php echo $member["clanRank"];?></td>
      <td style="width: 1cm;"><img src="<?php echo $member["league"]["iconUrls"]["tiny"]; ?>" alt="<?php echo $member["league"]["name"]; ?>"/></td>
      <td style="color: grey;"><?php echo $member["expLevel"]; ?></td>
      <td><?php echo "<b>", $member["name"], "</b><br/><span style='color: grey;'>", $member["role"], "</span>"; ?></td>
      <td style="color: grey;"><span style="color: black;">Donated:</span><br/><?php echo $member["donations"]; ?></td>
      <td style="color: grey;"><span style="color: black;">Received:</span><br/><?php echo $member["donationsReceived"]; ?></td>
      <td style="color: grey;"><span style="color: black;">Trophies:</span><br><?php echo $member["trophies"]; ?></td>
    </tr>
<?php
  }
?>
  </table>
</body>
</html>