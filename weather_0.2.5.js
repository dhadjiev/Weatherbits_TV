/* weatherbit.io API key */
// const majosr_api_key = "6cc2e980287442c0b7b602c8a4520fd0";

var data_Cache_Expires = [];
var _p_iterator = 0;

const majors = [
    {
        city: "Sofia", 
        lat: "42.69",
        lon: "23.32" 
    },
    {   
        city: "Burgas",
        lat: "42.50",
        lon: "27.46"
    }, 
    {
        city: "Varna",
        lat: "43.21",
        lon: "27.91"
    }, 
    {
        city: "Plovdiv",
        lat: "42.15",
        lon: "24.75"
    }, 
    {
        city: "Ruse",
        lat: "43.85",
        lon: "25.97"
    }
]; 

//const minors = ["Pleven", "VelikoTarnovo", "Dobritch", "Starazagora", "Kardzhali", "Blagoevgrad"];

/* requirements */
var fs = require('fs');
var rp = require('request-promise');
const timestamp = require('time-stamp');
const { render } = require('@nexrender/core');
const { resolve } = require('path');

/* render job settings */
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





function getWeatherEffect(weatherEffectData) {    
    var weatherEffect = 0;
    if (800 <= weatherEffectData && weatherEffectData <= 802) { weatherEffect = 1; };
    if (600 > weatherEffectData || weatherEffectData > 804 ) { weatherEffect = 2; };
    if (600 <= weatherEffectData && weatherEffectData < 700) { weatherEffect = 3; };
    return weatherEffect;
};
    

 
function getCurrentWeather(cities) {
    cities.forEach(place => {
        /* request sequence */
        rp.get('https://api.met.no/weatherapi/locationforecast/2.0/compact', {
            qs: {
                lat: place.lat,
                lon: place.lon
                //country:                          //feature not supported by MET Norway
                //lang:                             //feature not supported by MET Norway
            },
            headers: {
                'User-Agent': 'skat.bg/d.hadjiev@skat.bg',
                'If-modified-since': data_Cache_Expires
            },
            json: true,
            resolveWithFullResponse: true          //might be ommited uf no header is needed
        })
        /* response handler */
        .then(response => {
            //console.log("Got response for:" + place.city);           //sanity check
            if (response.statusCode > 299){
                if (response.statusCode == 304) {
                    console.log("New expirity date" + response.headers.expires);
                    data_Cache_Expires[_p_iterator] = response.headers.expires;
                    _p_iterator++;
                    reject(new Error('Data not changed.'));
                }
                if  (response.statusCode > 304) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
            } else {
                console.log(response.headers);
                console.log(response.body);
                console.log("New expirity date" + response.headers.expires);
                data_Cache_Expires[_p_iterator] = response.headers.expires;
                console.log(data_Cache_Expires);
                _p_iterator++;
                return response.body;
            }
        })       
        /* data handler*/     
        .then(body => {
            console.log("Processing body for:" + place.city);
            //weatherdata = data[0];            // current weather is in data field [0] 
                                                // with field name depending on source data structure

/* new MET Norway code */
            dataJSON = JSON.stringify(body.properties);
            fs.writeFileSync('C:/STATIC/WEATHER/DATA/CURRENT/' + place.city + '_data.json', dataJSON);
            console.log(timestamp('DD/MM/YYYY | HH:mm') + " Weather for " + place.city + " updated.");
/* end of MET Norway code /*


/*          weatherStateBG = extractWeatherStateBG(String(weatherdata.weather["code"]));
            weatherStateCode = getWeatherCode(weatherdata.weather["icon"]);
            weatherEffectState = getWeatherEffect(Number(weatherdata.weather["code"])); */
            //console.log(weatherdata.weather["code"]);
            //console.log(weatherEffectState);

/*      stara versia      
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
            console.log(timestamp('DD/MM/YYYY | HH:mm') + " Weather for " + weatherdata.city_name + " updated.");
            setTimeout(function(){},10000);    */        

/* rp end */
        })
        .catch(function(err){
            console.error(err);
        }); /**/
/* forEach end */
    });
    console.log(data_Cache_Expires);
    //return weatherJSON; 
/* getCurrentWeather end */
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
async function main() {

    getCurrentWeather(majors);
    console.log(data_Cache_Expires);
    _p_iterator = 0;
    //getCurrentWeather(majors, majosr_api_key);
    //getCurrentWeather(minors, minors_api_key);
    /*    nexRndr();
    
    
        setInterval(function () {
            getCurrentWeather(majors, majosr_api_key);
            //getCurrentWeather(minors, minors_api_key);
            nexRndr();
        }, 900000);
    */
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