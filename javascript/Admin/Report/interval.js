$(window).ready(function () {
    var selectStartDate = function (e) {
        var datestamp = e.format(0, 'yyyymmdd');
        window.location.href = 'counseling/Admin/Report/Interval/' + datestamp + '/' + endStr;
    };

    var selectEndDate = function (e) {
        var datestamp = e.format(0, 'yyyymmdd');
        window.location.href = 'counseling/Admin/Report/Interval/' + startStr + '/' + datestamp;
    };

    $('#pick-start-date').datepicker({
        format: 'yyyymmddd',
        defaultViewDate: startDate,
        todayHighlight: true,
        todayBtn: true
    });

    $('#pick-end-date').datepicker({
        format: 'yyyymmddd',
        defaultViewDate: endDate,
        todayHighlight: true,
        todayBtn: true
    });

    $('#pick-start-date').datepicker().on('changeDate', selectStartDate);
    $('#pick-end-date').datepicker().on('changeDate', selectEndDate);

    $('#pick-start-date').click(function (e) {
        e.preventDefault();
        $('#pick-start-date').datepicker('show');
        $('#pick-end-date').datepicker('hide');
    });
    $('#pick-end-date').click(function (e) {
        e.preventDefault();
        $('#pick-end-date').datepicker('show');
        $('#pick-start-date').datepicker('hide');
    });
});
