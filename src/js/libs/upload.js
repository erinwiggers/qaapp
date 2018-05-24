$(document).ready(function (e) {
    $("#uploadimage").on('submit', (function (e) {
        var url = $("input[name=compUrl]").val();
        e.preventDefault();
        window.open("/qaapp/compare.html?url=" + url);
    }));

    // Function to preview image after validation
    $(function () {
        $("#file").change(function () {
            $("#message").empty(); // To remove the previous error message
            var file = this.files[0];
            var imagefile = file.type;
            var match = ["image/jpeg", "image/png", "image/jpg"];
            if (!((imagefile == match[0]) || (imagefile == match[1]) || (imagefile == match[2]))) {
                $('#previewing').attr('src', 'noimage.png');
                $("#message").html("<p id='error'>Please Select A valid Image File</p>" + "<h4>Note</h4>" + "<span id='error_message'>Only jpeg, jpg and png Images type allowed</span>");
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
                var file = this.files[0];
                localStorage.setItem("file", file);
            }
        });
    });
    function imageIsLoaded(e) {
        $("#file").css("color", "green");
        $('#image_preview').css("display", "block");
        $('#previewing').attr('src', e.target.result);
        $('#previewing').attr('width', '250px');
        $('#previewing').attr('height', '230px');
    };
});