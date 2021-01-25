$(document).ready(function () {
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, maxOcc, numElev; // numElev
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
    });


    function getInfoNumApp() {
        numApp = $('#numApp').val();
    };

    function getInfoNumFloors() {
        numFloors = $('#numFloors').val();
    };

    function getInfoNumBase() {
        numBase = $('#numBase').val();
    };

    function getInfoNumElev() {
        numElev = $('#numElev').val();
    };

    function getInfoMaxOcc() {
        maxOcc = $('#maxOcc').val();
    };


    $('#standard').on('click', function () {
        document.getElementById('elevPriceUnit').value = (7565).toFixed(2) + " $";       // 7565 ---> getProdRange(), standart -->standard
        doCalc();
    });
    $('#premium').on('click', function () {
        document.getElementById('elevPriceUnit').value = (12345).toFixed(2) + " $";       // 7565 ---> getProdRange(), standart -->standard
        doCalc();
    });
    $('#excelium').on('click', function () {
        document.getElementById('elevPriceUnit').value = (15400).toFixed(2) + " $";       // 7565 ---> getProdRange(), standart -->standard
        doCalc();
    });

    


    function initialize() {
        $('.formField').val('');
        $('.productRangeBtn').prop('checked', false);
    };

    $('#residential, #commercial, #corporate, #hybrid').on('click', function () {
        initialize();
    });

                        //  getInfoNumApp(); added
    function GetInfos() {                   
        getInfoNumApp();
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
    };




    function getProdRange() {
        if ($('#standard').is(':checked')) {
            prodRange.type = "standard";
            prodRange.price = parseFloat(7565);
            prodRange.installationFeePercentage = 0.1;
            return prodRange;

        } else if ($('#premium').is(':checked')) {
            prodRange.type = "premium";
            prodRange.price = parseFloat(12345);            // 6
            prodRange.installationFeePercentage = 0.13;
            return prodRange;

        } else if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = parseFloat(15400);
            prodRange.installationFeePercentage = 0.16;
            return prodRange;
        } else {
            prodRange.type = null,
            prodRange.price = null,
            prodRange.installationFeePercentage = null
            return prodRange;
        }
    };


    function setRequiredElevatorsResult(finNumElev) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));
    };

    function setPricesResults(finNumElev, subTotal, installationFee, total) {      // roughtotal ----->    subTotal       , // installationFee
        $("#elevTotal").val(parseFloat(subTotal).toFixed(2) + " $");
        $("#installationFee").val(parseFloat(installationFee).toFixed(2) + " $");           // installationFee
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
        $("#NumElev_2").val(parseFloat(finNumElev));                                // number not float
    };

    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_3').val('');
        $('#numElev_2').val('');                    // a new line added , numElev_2
        $('.priceField').val('');
    };

    function createFormData(projectType) {
        return {
            numberElev: numElev,                     // numElev
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            maximumOcc: maxOcc,
            productRange: prodRange,
            projectType: projectType,                       // comma added
        }
    };

    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return true

        } else if ($('#numBase').val() < 0) {

            alert("Please enter a positive number!");
            $('#numBase').val('');
            return true

        } else if ($('#numFloors').val() < 0) {                     // numFloors

            alert("Please enter a positive number!");
            $('#numFloors').val('');
            return true

        } else if ($('#numComp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numComp').val('');
            return true

        } else if ($('#numPark').val() < 0) {

            alert("Please enter a positive number!");
            $('#numPark').val('');
            return true

        } else if ($('#numElev').val() < 0) {

            alert("Please enter a positive number!");
            $('#numElev').val('');
            return true

        } else if ($('#numCorpo').val() < 0) {

            alert("Please enter a positive number!");
            $('#numCorpo').val('');
            return true

        } else if ($('#maxOcc').val() < 0) {

            alert("Please enter a positive number!");
            $('#maxOcc').val('');
            return true
        } else {
            return false
        }
    };

    function apiCall(projectType) {
        //Getting numbers from quote
        GetInfos();

        //Preparing data for Api call
        formData = createFormData(projectType)

        $.ajax({
            type: "POST",
            // url: 'http://localhost:3000/api/quoteCalculation/', //for local testing
            url: 'https://rocketelevators-quote.herokuapp.com/api/quoteCalculation/',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                setRequiredElevatorsResult(data.finalNumElev);
                if (prodRange.type != null) {
                    setPricesResults(data.finalNumElev, data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && !negativeValues() && $('#numApp').val() && $('#numFloors').val() && $('#numBase').val()) {
            apiCall('residential')

        } else if ($('#commercial').hasClass('active') && !negativeValues() && $('#numElev').val()  && $('#numPark').val() && $('#numFloors').val() && $('#numBase').val() && $('#numComp').val()) {
            apiCall('commercial')

        } else if ($('#hybrid').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#numComp').val() && $('#numPark').val() && $('#maxOcc').val()) {
            apiCall('hybrid')                                                        // corporate and numCorpo
                                                                                            
        } else if ($('#corporate').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val() && $('#numCorpo').val() && $('#numPark').val()) {
            apiCall('corporate')                                                                                                                           // hybrid added
        } else {
            emptyElevatorsNumberAndPricesFields();
        };
    };
});
