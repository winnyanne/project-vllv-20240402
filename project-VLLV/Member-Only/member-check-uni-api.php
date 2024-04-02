<?php
    //input: {"Username":"XX"}
    // {"state" : true, "message" : "帳號不存在, 可以使用!"}
    // {"state" : false, "message" : "帳號已存在,不可以使用!"}
    // {"state" : false, "message" : "傳遞參數格式錯誤!"}
    // {"state" : false, "message" : "未傳遞任何參數!"}

    $data = file_get_contents("php://input", "r");
    if ($data != "") {
        $mydata = array();
        $mydata = json_decode($data, true);
        if (isset($mydata["Username"]) && $mydata["Username"] != "" ) {
            $p_Username = $mydata["Username"];

            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "vllvDB";
            // 先宣告要使用的資料庫，然後檢查連線是否成功
            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "SELECT Username FROM member WHERE Username = '$p_Username'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) == 0){
                //無相同帳號, 可以使用
                echo '{"state" : true, "message" : "帳號不存在, 可以使用!"}';
            } else {
                //帳號存在, 不可以使用
                echo '{"state" : false, "message" : "帳號存在已存在, 不可以使用!"}';
            }
            mysqli_close($conn);
        } else {
            echo '{"state" : false, "message" : "傳遞參數格式錯誤 ! 0123-product01-Create-uni-api.php"}';
        }
    } else {
        echo '{"state" : false, "message" : "未傳遞任何參數 ! 0201-member-check-uni-api.php"}';
    }
?>