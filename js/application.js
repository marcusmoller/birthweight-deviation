function BWFromGA(gender, ga) {
  /**
   * Calculates birthweight given the gender and GA
   *
   * @param gender Integer for gender for calculations, boy == 0 and girl == 1
   * @param ga Integer for gestationalage in days
   * @return integer normal birthweight for given ga
   */

  if (gender == 0) { // boy
    return -1.907345e-6*Math.pow(ga, 4) +
      1.140644e-3*Math.pow(ga, 3) +
      -1.336265e-1*Math.pow(ga, 2) +
      (1.976961e+0)*ga +
      2.410053e+2;

  } else if (gender == 1) {
    return -2.761948e-6*Math.pow(ga, 4) +
      1.744841e-3*Math.pow(ga, 3) +
      -2.893626e-1*Math.pow(ga, 2) +
      (1.891197e+1)*ga +
      -4.135122e+2
  }
}
function checkInput() {
  /**
   * Checks if input is in correct format and range
   *
   * @return true if everything is OK, false if not
   */

  // check week input for range between 22 and 44
  if (parseInt($('#input-ga').val().substr(0, 2)) < 22 || parseInt($('#input-ga').val().substr(0, 2)) > 44) {
    return false;
  }

  if ($('#input-bw').val() != "") {
    // input birth weight must be between 300 and 7000
    if (parseInt($('#input-bw').val()) < 300 || parseInt($('#input-bw').val()) > 7000) {
      return false;
    }
  }

  return true;
}
function calcBW() {
  /**
   * Main function called when doing calculations.
   * This function is called when input is changed.
   */

  // get gender
  var gender = null;
  if ($("#btn-boy").hasClass("btn-primary")) {
    gender = 0;
  }  else {
    gender = 1;
  };

  // get input
  var input = $('#input-ga').val();
  var input_split = input.split('+');
  var ga = null;

  if (input.length >= 2 && input_split.length >= 2) {
    // if entry is correct...
    
    if (checkInput() != true) return;

    if (input_split[1] != '') {
      ga = parseInt(input_split[0])*7 + parseInt(input_split[1])
    } else {
      ga = parseInt(input_split[0])*7
    }

    // do calculations
    var bw = BWFromGA(gender, ga);
    var p_dev = ((parseInt($("#input-bw").val())/bw)-1)*100
    var sdev  = p_dev/12;

    // print output
    $("#ga-days").text(ga);
    $("#ga-weeks").text(Math.floor(ga/7) + "+" + ga%7);
    $("#ga-nw").text(Math.round(bw) + " gram");

    if ($("#input-bw").val() != "") {
      // birth weight is given
      $("#ga-weightdeviation-percent").text(p_dev.toFixed(1) + " %");
      $("#ga-weightdeviation-sd").text(sdev.toFixed(2) + " SD");

      if (sdev <= -2) { /* SGA */
        $("#ga-status").text("SGA");
        $('.row-weightdeviation').css('color', 'red');
      } else if (sdev >= 2) { /* LGA */
        $("#ga-status").text("LGA");
        $('.row-weightdeviation').css('color', 'red');
      } else { /* AGA */
        $("#ga-status").text("AGA");
        $('.row-weightdeviation').css('color', 'black');
      }

      // show table
      $(".row-weightdeviation").show();

    } else if ($("#input-bw").val() == "") {
      $("#ga-weightdeviation-percent").text("Indtast fødselsvægt");
      $("#ga-weightdeviation-sd").text("Indtast fødselsvægt");
      $("#ga-status").text("Indtast fødselsvægt");

      // hide table
      $(".row-weightdeviation").hide();

    }

    // toggle result div
    if ($("#res-out").is(":hidden")) {
      $("#res-wait").hide();
      $("#res-out").show();
    }
  } else {
    if ($("#res-out").is(":visible")) {
      $("#res-wait").show();
      $("#res-out").hide();
    }
  }
}

/* UI HOOKS */
$('#btn-grp-gender').on('click', function() {
  if ($(this).find('.btn-primary').length>0) {
    $(this).find('.btn').toggleClass('btn-primary');
  }
  $(this).find('.btn').toggleClass('btn-light');

  // recalculate
  calcBW();
});
$('#input-ga').change(function() {
  /* check format */
  if ($(this).val()[2] != '+') {
    alert('Oplyst gestationsalder skal indtastest i formatet uger+dage (UU+D).');
    $(this).val('');
    $(this).focus();
    return;
  };

  /* check week range */
  if (parseInt($(this).val().substr(0, 2)) < 22 || parseInt($(this).val().substr(0, 2)) > 44) {
    alert("Oplyst gestationsalder accepteres kun i intervallet 22+0 til 44+0.");
    $(this).val('');
    return;
  }

  // everything went ok, unfocus
  $(this).blur();
});
$('#input-bw').change(function() {
  if (parseInt($(this).val()) < 300 || parseInt($(this).val()) > 7000) {
    alert("Accepterer kun indtastning af fødselsvægte i intervallet 300 til 7000 gram.");
    $(this).val('');

    // hide table
    $(".row-weightdeviation").hide();
  } else {
    // unfocus when succesful
    $(this).blur();
  };
});
