module.exports.solution = async (event) => {
    const data = JSON.parse(event.body);
    
    let gruposDeAmigos = data.groups;
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