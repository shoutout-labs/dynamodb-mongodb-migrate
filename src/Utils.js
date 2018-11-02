'use strict';

class Utils{
    static waitFor(milliseconds){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve();
            },milliseconds);
        });
    }
}

module.exports = Utils;