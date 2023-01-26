/* weatherbit.io API key */
// const majosr_api_key = "6cc2e980287442c0b7b602c8a4520fd0";
const date_start = new Date(0);

const majors = [
    {
        city: "Sofia", 
        lat: "42.69",
        lon: "23.32",
        expires: date_start,
        modified: date_start
    },
    {   
        city: "Burgas",
        lat: "42.50",
        lon: "27.46",
        expires: date_start,
        modified: date_start
    }, 
    {
        city: "Varna",
        lat: "43.21",
        lon: "27.91",
        expires: date_start,
        modified: date_start
    }, 
    {
        city: "Plovdiv",
        lat: "42.15",
        lon: "24.75",
        expires: date_start,
        modified: date_start
    }, 
    {
        city: "Ruse",
        lat: "43.85",
        lon: "25.97",
        expires: date_start,
        modified: date_start
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
    

 
function getWeather(cities)  {
/* request sequence */
    rp.get('https://api.met.no/weatherapi/locationforecast/2.0/compact', {
        qs: {
            lat: place.lat || 'lat',
            lon: place.lon || 'lon'
            //country:                          //feature not supported by MET Norway
            //lang:                             //feature not supported by MET Norway
        },
        headers: {
            'User-Agent': 'skat.bg/d.hadjiev@skat.bg',
            'If-modified-since': place.modified || Date.now()
        },
        json: true,
        resolveWithFullResponse: true          //might be ommited if no header is needed
    })
/* response handler */
    .then(response => {
        //console.log("Got response for:" + place);             //sanity check
        if (response.statusCode > 299) {
            if (response.statusCode == 304) {
                console.log("New expirity date" + response.headers.expires);
                place.expires = response.headers.expires;
                reject(new Error('Data not changed.'));
            }
            if (response.statusCode > 304) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
        } else {
                //console.log(response.headers);                //response validation check
                //console.log(response.body);                   //response validation check
                console.log("New expirity date" + response.headers.expires);
                place.expires = response.headers.expires;
                //place.modified = reasponse.headers.last-modified;
                //console.log(data_Cache_Expires);              //sanity check
                return response.body;
            }
    })       
/* data handler*/     
    .then(body => {
        console.log("Processing body for:" + place.city);
        //weatherdata = data[0];            // current weather is in data field [0] 
                                            // with field name depending on source data structure

/* MET Norway code */
            let data = body.properties;
            dataJSON = JSON.stringify(data);
            fs.writeFileSync('C:/STATIC/WEATHER/DATA/CURRENT/' + place.city + '_data.json', dataJSON);
            //console.log(timestamp('DD/MM/YYYY | HH:mm') + " Weather for " + place.city + " updated.");

/* rp end */
        })
        .catch(function(err){
            console.error(err);
        }); /**/
    //console.log(data_Cache_Expires);
    //return dataJSON; 
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

    majors.forEach((place => {
        getWeather(place);
    }));
    //majors.forEach((place) => {
    //    setinterval(getWeather(place), place )
    }
    //getCurrentWeather(majors, majosr_api_key);
    //getCurrentWeather(minors, minors_api_key);
    /*    nexRndr();
    
    
        setInterval(function () {
            getCurrentWeather(majors, majosr_api_key);
            //getCurrentWeather(minors, minors_api_key);
            nexRndr();
        }, 900000);
    */


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