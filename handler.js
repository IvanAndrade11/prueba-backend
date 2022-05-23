module.exports.solution = async (event) => {
    const data = JSON.parse(event.body);
    let sizesX = [];
    let xMin = 0;
    
    try {
        const grupos = data.groups.split(",");

        const nPersonas = grupos.reduce((acc, cur) => {
            xMin = xMin > parseInt(cur) ? xMin : parseInt(cur);
            return parseInt(acc) + parseInt(cur);
        }, 0);
       
        if(isNaN(xMin) || isNaN(nPersonas)){
            throw "Bad Request";
        } 

        while (xMin <= nPersonas) {
            (nPersonas % xMin) == 0 && sizesX.push(xMin);
            xMin++;
        }
        
        return response(200, sizesX.join())
    } catch (error) {
        return response(400, error)
    }

};

const response = (code, data) => {
    return {
        statusCode: code,
        body: JSON.stringify(
            { 
                sizes: data
            }
        ),
    };
}