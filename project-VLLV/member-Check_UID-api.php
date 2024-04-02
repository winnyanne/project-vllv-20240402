<?php
    // {"UID01":"XXXXXXXXXXXXX"}
    // {"state" : true, "data": "會員資料", "message" : "驗證成功, 可以登入!"}
    // {"state" : false, "message" : "驗證失敗, 不許登入!"}
    // {"state" : false, "message" : "傳遞參數格式錯誤!"}
    // {"state" : false, "message" : "未傳遞任何參數!"}

    $data = file_get_contents("php://input", "r");
    if ($data != "") {
        $mydata = array();
        $mydata = json_decode($data, true);
        if (isset($mydata["UID01"]) && $mydata["UID01"] != ""){
            $p_UID01 = $mydata["UID01"];

            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "vllvDB";

            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "SELECT Username, Email, UID01 FROM member WHERE UID01 = '$p_UID01'";
            $result = mysqli_query($conn, $sql);
            if(mysqli_num_rows($result) == 1){
                //驗證成功
                $mydata = array();
                while($row = mysqli_fetch_assoc($result)){
                    $mydata[] = $row;
                }
            
                echo '{"state" : true, "data": '.json_encode($mydata).', "message" : "驗證成功, 可以登入!"}';
            }else{
                //驗證失敗
                echo '{"state" : false, "message" : "驗證失敗, 不許登入!'.$sql.'"}';
            }
            
            mysqli_close($conn);
        } else {
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    } else {
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
?>