/* bg weather state handler */

function extractWeatherStateBG(sourceStateCode) {
    var weatherstate;
    switch (sourceStateCode) {

        case "200": case "201": case "202": 
        case "230": case "231": case "232": 
        case "233":    
            weatherstate = "БУРЯ";
            break;
        
        case "300": case "301": case "302":
            weatherstate = "РЪМЕЖ";
            break;
        
        case "500": case "501": case "502":                            
            weatherstate = "ДЪЖДОВНО";
            break;
        
        case "511":                            
            weatherstate = "ЛЕДЕН ДЪЖД";
            break;
        
        case "520": case "521": case "522":                            
            weatherstate = "СИЛЕН ДЪЖД";                     
            break;
        
        case "600": case "601": case "602":                            
            weatherstate = "СНЕГОВАЛЕЖ";
            break;

        case "610": case "611": case "612":                            
            weatherstate = "СНЯГ И ДЪЖД";
            break;

        case "621": case "622":
            weatherstate = "ОБИЛЕН СНЕГОВАЛЕЖ";
            break;

        case "623":
            weatherstate = "СЛАБ СНЕГОВАЛЕЖ";
            break;

        case "700": case "711": case "721":
        case "731": case "741": case "751":
            weatherstate = "МЪГЛИВО";
            break;

        case "800":                
            weatherstate = "ЯСНО";
            break;

        case "801": case "802":
            weatherstate = "РАЗКЪСАНА ОБЛАЧНОСТ";
            break;

        case "803": case "804":
            weatherstate = "ОБЛАЧНО";
            break;

        case "900":
            weatherstate = "ВАЛИ";
            break;
    };
    return weatherstate;
};