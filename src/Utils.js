'use strict';

class Utils{
    static waitFor(milliseconds){
        return Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve();
            },milliseconds);
        });
    }
}

module.exports = Utils;