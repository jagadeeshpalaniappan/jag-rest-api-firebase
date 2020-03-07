
/**
    handlePromise
    @param: promise
*/
async function hp(promise) {
    try {
        console.debug('#try:');
        const resp = await promise;
        console.debug('#success:');
        return [null, resp];
    } catch (err) {
        console.debug('#err:', err);
        return [err, null];
    }
}


function hp1(promise) {
    return promise
        .then((resp)=> { console.debug('#success:'); return [ null, resp]})
        .catch((err)=> { console.debug('#err:'); return [ err, null ]});
}


module.exports = { hp };
