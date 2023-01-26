/* weatherbit.io API key */
const majosr_api_key = "c051ac7e064b4865a49ae746357ee46b";  
const majors = ["Sofia", "Burgas", "Varna", "Plovdiv", "Ruse"]
/* minors */
/*
const BH = "&city=Vidin,bg";
const M = "&city=Montana,bg";
const EH = "&city=Pleven,bg";
const PP = "&sity=Razgrad,bg";
const CC = "%city=Silistra,bg";

const minors = ["Pleven", "VelikoTarnovo", "Gabrovo", "Shumen", "Dobritch", "Targovishte", "Starazagora", "Kardzhali", "Blagoevgrad"];
const minors_api_key = "3143a0af88a743909db9aed83cb0d92f";

const OB = "&city=Lovetch,bg";
const BT = "&city=VelikoTarnovo,bg";
const T = "&city=Targovishte,bg";
const CH = "&city=Sliven,bg";
const CT = "&city=StaraZagora,bg";

const PK = "&city=Pernik,bg";
const E = "&city=Blagoevgrad,BG";
const PA = "&city=Pazardzhik,bg";
const K = "&city=Kardzhali,bg";
const CM = "&city=Smolyan,BG";
*/
/* requirements */
var fs = require('fs');
var rp = require('request-promise');
//const { createClient } = require('@nexrender/api');
const timestamp = require('time-stamp');
const { render } = require('@nexrender/core');
const { randomInt } = require('crypto');
const render_job = {
    "template": {
        "src" : 'file:///C:/STATIC/WEATHER/template.aep',
        "composition" : 'main_short',
        "dest":"C:\\TEMP\\WEATHER\\template.aep"
    },
    "actions": {
        "postrender": [
            {
                "module": "@nexrender/action-encode",
                "output": "foobar.mp4",
                "preset": "mp4",
                "params": { "-vcodec": "libx264",
                            "-weightp": 0,
                            "-b": 4194304, 
                            "-r": 25,
                            //"-vf": "tinterlace=interleave_top,fieldorder=tff",
                            //"-preset": "placebo",
                            "-f": "mpegts",
                            "-flags": "+ildct+ilme",
                            "-acodec": "aac"
                         }
            },
            {
                "module": "@nexrender/action-copy",
                "input": 'foobar.mp4',
                "output": 'Z:/000RABOTNA/ZA EFIR/vremeto.mp4'
            }
        ]
    }
}

/*some number padding */
//const zeroPad = (num, places) => String(num).padStart(places, '0')

async function nexRndr() {
    try {
        const result = await render(render_job, {
            workpath: 'C:/TEMP',
            skipCleanup: false,
            addLicense: false,
            debug: false
        });
    result.onRenderProgress(console.log(render_job.renderProgress))
    } catch(err) {
        console.error(err)
    }
}

//nexRndr.catch(console.error);

/* requests */

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

function getWeatherCode(weatherIconCode) {
    var weatherCode;
    switch (weatherIconCode) {
        case "s06d": case "s06n": case "s04d":
        case "s04n": case "s03d": case "s03n":
        case "s02d": case "s02n": case "s01d":
        case "s01n":
            weatherCode = 1;
            break;    
    
        case "r06d": case "r06n": case "r05d":
        case "r05n": case "r04d": case "r04n":
        case "r03n": case "r02n": case "r01n":
        case "f01n": case "t05d": case "t05n":
        case "t03d": case "t03n": case "t02n":
        case "t01n": case "u00d": case "u00n":
            weatherCode = 2;
            break;
    
        case "d03d": case "d03n": case "d02d":
        case "d02n": case "d01d": case "d01n":
        case "t04d": case "t04n":
            weatherCode = 3;
            break;
    
        case "c04d": case "c04n": case "a04d":
        case "a04n": case "a05d": case "a05n":
        case "a06d": case "a06n":
            weatherCode = 4;
            break;
    
        case "a01d": case "a01n": case "a02d":
        case "a02n": case "a03d": case "a03n":
        case "c03d": case "c03n": case "s05d":
        case "s05n":
            weatherCode = 5;
            break;
    
        case "r03d": case "r02d": case "r01d":
        case "f01d": case "t02d": case "t01d":
            weatherCode = 6;
            break;
    
        case "c02d":
            weatherCode = 7;
            break;
    
        case "c01d":
            weatherCode = 8;
            break;
    
        case "c02n":
            weatherCode = 9;
            break;
    
        case "c01n":
            weatherCode = 10;
            break;
    };
    return weatherCode;
};

function getWeatherEffect(weatherEffectData) {    
    var weatherEffect = 0;
    if (800 <= weatherEffectData && weatherEffectData <= 802) { weatherEffect = 1; };
    if (600 > weatherEffectData || weatherEffectData > 804 ) { weatherEffect = 2; };
    if (600 <= weatherEffectData && weatherEffectData < 700) { weatherEffect = 3; };
    return weatherEffect;
};
    

            /* not used yet
            var wind_direction;
            switch (weatherdata.wind_cdir_full) {
                case "north":
                    wind_direction = "северен";
                    break;
                case "south":
                    wind_direction = "южен";
                    break;
                case "east":
                    wind_direction = "източен";
                    break;
                case "west":
                    wind_direction = "западен";
                    break;
                case "southeast":
                    wind_direction = "от югоизток";
                    break;
                case "southwest":
                    wind_direction = "от югозапад";
                    break;
                case "northeast":
                    wind_direction = "от североизток";
                    break;
                case "northwest":
                    wind_direction = "от северозапад";
                    break;
            }
            */
function getCurrentWeather(place,api_key) {
    //var weatherJSON = [];
    
    //cities.forEach(place => {
        rp.get('https://api.weatherbit.io/v2.0/current', {
            qs: {
                key: api_key,
                city: place,
                country: 'BG'
                //lang: 'bg'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        })
        .then((response) => response.data)       
        .then(data => {
            weatherdata = data[0];
            //console.log(data);
            weatherStateBG = extractWeatherStateBG(String(weatherdata.weather["code"]));
            weatherStateCode = getWeatherCode(weatherdata.weather["icon"]);
            weatherEffectState = getWeatherEffect(Number(weatherdata.weather["code"]));
            //console.log(weatherdata.weather["code"]);
            //console.log(weatherEffectState);

            var weatherObject = {
                "temp" : Math.round(weatherdata.temp),
                "weather_icon" : weatherStateCode,
                "wind_spd" : Math.trunc(Math.round(weatherdata.wind_spd)),
                //"wind_dir" : wind_direction,
                "humidity": Math.trunc(Math.round(weatherdata.rh)),
                "weather_state" : weatherStateBG,
                "weather_effects" : weatherEffectState,
                "city" : weatherdata.city_name
            };
            //console.log(weatherObject); 
            //dataJSON = JSON.stringify(String(weatherdata.weather["code"]));
            weatherJSON = JSON.stringify(weatherObject);
            //return weatherJSON;
            //console.log(weatherJSON);
            //fs.writeFileSync('C:/STATIC/WEATHER/DATA/CURRENT/' + weatherdata.city_name + '_data.json', dataJSON);
            fs.writeFileSync('C:/STATIC/WEATHER/DATA/CURRENT/' + weatherdata.city_name + '.json', weatherJSON);
            console.log(timestamp('DD/MM/YYYY | HH:mm:ss') + " Weather for " + weatherdata.city_name + " updated.");
            //setTimeout(function(){},10000);
            return 1;            
        })
        .catch(function(err){
            console.error(err.statusCode);
            return err.statusCode;
        });

    //console.log(weatherJSON);
    //return weatherJSON; 
};
/* function getAllCityData() {
    setInterval( function() { getCurrentWeather(majors)}, 3600000);
    //setTimeout(function(){},120000);
    //getCurrentWeather(minors);
    return
}; 
const i = 0;
while (i < 1) {
    getCurrentWeather(majors);
    setTimeout(function(){},900000);
}*/

function randomTimetout() {
    result = 1000 + Math.floor(Math.random() * Math.floor(100));
    return result
};

const main = async () => {

    majors.forEach(major => {
        setTimeout(function() {},randomTimetout());
        getCurrentWeather(major, majosr_api_key);
    })
    nexRndr();
    //getCurrentWeather(majors, majosr_api_key);
    //getCurrentWeather(minors, minors_api_key);
    //nexRndr();


    setInterval(function () {
        majors.forEach(major => {
            setTimeout(function() {}, randomTimetout());
            getCurrentWeather(major, majosr_api_key);
            
        });
        nexRndr();
    }, 10800000);

}

main().catch(console.error);
/*
getCurrentWeather(majors, majosr_api_key);
getCurrentWeather(minors, minors_api_key);
setInterval( function() {
    getCurrentWeather(majors, majosr_api_key);
    getCurrentWeather(minors, minors_api_key);
}, 900000);






/*
fs.writeFile('Z:/VREMETO/new_forecast/majors.json', getCurrentWeather(majors) , err =>{
    if (err) {
        return console.error(err);
    }
});
*/