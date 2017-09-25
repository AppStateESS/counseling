$(window).ready(function(){
    var selectDate = function(e) {
        var datestamp = e.format(0, 'yyyymmdd');
        window.location.href = 'counseling/Admin/Report/' + reportType +'/' + datestamp;
    };
    $('#pick-date').datepicker({
        format : 'yyyymmddd',
        defaultViewDate : defaultDate,
        todayHighlight : true,
        todayBtn : true
    });
    $('#pick-date').datepicker().on('changeDate', selectDate);

    $('#pick-date').click(function(e){
        e.preventDefault();
        $('#pick-date').datepicker('show');
    });
});
