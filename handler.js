'use strict';

module.exports.solution = async (event) => {
    let gruposDeAmigos = event.groups;
    let nPersonas = 0;
    let sizesBus = '';
    let capacidad = 0;

    for(let grupo of gruposDeAmigos) {
        if (grupo !== ',' && !isNaN(grupo)){
            grupo = parseInt(grupo);
            nPersonas += grupo;
            capacidad = grupo > capacidad ? grupo : capacidad;
        }
    }
   
    while (capacidad <= nPersonas) {
        if(( nPersonas % capacidad ) == 0){
            sizesBus += `${capacidad},`
        }
        capacidad++;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                sizes: sizesBus.slice(0, -1)
            },
            null,
            2
        ),
    };
};

// const entrada = { "groups": "1,2,1,1,1,2,1,3" }
// (async () => {
//     const res = this.solution(entrada);
//     console.log(res)
// })();