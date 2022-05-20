# Prueba Desarrollador BackEnd 

## Descripción

Se plantea desarrollar una solución a un problema lógico, el cuál debe implementar una función **AWS Lambda** en _Java_ o _Node JS_. Esta debe exponerse como **API REST** a través del servicio **AWS API GATEWAY**.

## Problema a resolver

>Hay _**n**_ grupos de amigos y cada grupo es numerado del **1** al _**n**_. EL _**ith**_ grupo contiene _**ai**_ personas.
>
>Todos viven cerca de una parada de bus, y solo un bus funciona en esa ruta. EL bus vacío llega a la parada y todos los grupos quieren viajar en el bus. 
>Sin embargo, cada grupo de amigos no quiere separarse. Así que entran al bus solo si el bus puede llevar todo el grupo.
>
>Además, los grupos no quieren cambiar su posición relativa mientras viajan. En otras palabras, el grupo 3 no puede viajar en el bus, a menos que el grupo 1 y el 2 ya hayan viajado, adicionalmente es necesario que todos estén sentados dentro del autobús en este momento, lo que quiere decir que un bus de capacidad _**x**_ solo puede transportar _**x**_ personas simultáneamente.
>
>Encuentre todos los posibles tamaños de _**x**_ del bus para que pueda transportar a todos los grupos, cumpliendo con las condiciones anteriores, y cada vez que el bus salga de la estación, no haya sillas vacías en el bus (es decir, el número total de personas presentes dentro del bus es igual a _**x**_).

## Examples

### Request
```
{
    "groups" : "1,2,1,1,1,2,1,3"
}
```
### Response
```
{
    "sizes" : "3,4,6,12"
}
```

## Desarrollo de la solución

### Arquitectura

| ![Data](https://ps.w.org/amazon-polly/assets/icon-256x256.png?rev=2183954) | ![Data](https://images.opencollective.com/goserverless/93e050b/logo/256.png) |
| ---      | ---       |
| **Lambda:** prueba-backend-dev-solution | Deployment con **Serverless Framework** |
| **API Gateway:** dev-prueba-backend |

**Punto de enlace de API:** https://rrhgs3xba1.execute-api.us-east-1.amazonaws.com/dev/

### Aprovisionamiento

- Se creó una **cuenta** en AWS personal con acceso a los servicios necesarios. 

- Desde la consola de AWS se añadió un nuevo usuario de **IAM** con permisos _AdministratorAccess_ generando  el ID de clave de acceso.

- Se instaló **AWS Command Line Interface** y se ejecutó el siguiente comando para configurar las credenciales de acceso AWS:
```bash
$ aws configure
```
>AWS CLI almacena la información confidencial de credenciales que usted especifica con  **aws configure** en un archivo local denominado credentials, en una carpeta denominada **.awsen** su directorio de inicio.

- Se instaló el framework **Serverless** con el siguiente comando:
```bash
$ npm install -g serverless
```
- Se creó el directorio local llamado _prueba-backend_ y se ejecutó el siguiente comando para luego seleccionar el tipo de proyecto serverless (aws - node JS)
```bash
$ serverless
```
> Luego de este paso, se creó en el directorio local varios archivos entre ellos _serverless.yml_ y _handler.js_.

- Se realizó el aprovisionamiento de la infraestructura desde el archivo _serverless.yml_ indicando el nombre de la función lambda, tipo de API (REST) y método (POST).
```
	service: prueba-backend

	frameworkVersion: '3'

	provider:
	  name: aws
	  runtime: nodejs14.x

	functions:
	  solution:
		handler: handler.solution
		events:
		  - http:
			  path: /
			  method: post
```
- Se generó el deployment de la infraestructura en **AWS** con el siguiente comando 
```bash
$ serverless deploy --verbose
```
>verbose para ver la salida del comando

- Finalmente se codificó la lógica de la solución en el archivo _handler.js_. y se generó un segundo deployment con el comando:
```bash
$ sls deploy
```

### Codificación v2.0

- En nuestro método asíncrono, recibimos el _evento_ y lo convertimos a formato JSON.
```javascript
    const data = JSON.parse(event.body);
```

- Definimos las variables que serán usadas para resolver el ejercicio.
```javascript
    let sizesX = []; //Array donde guardaremos los posibles valores de x
    let xMin = 0; // Definimos la capacidad minima inicial de un bus
```

- Iniciamos un bloque try-catch y convertimos el string _groups_ recibido en el _evento_ en un _array_ de grupos.
```javascript
    try {
        const grupos = data.groups.split(",");
```

- Aplicamos _reduce_ al array de grupos para retornar a la varialbe _nPersonas_ el total de personas.
```javascript
        const nPersonas = grupos.reduce((acc, cur) => {
            xMin = xMin > parseInt(cur) ? xMin : parseInt(cur); // Con un ternario guardamos la capacidad mínima
            return parseInt(acc) + parseInt(cur); // Retornamos la suma de todos los grupos
        }, 0); // Definímos 0 como índice inicial
```

- Lanzamos una excepción si no encontramos los datos necesarios para continuar.
```javascript
        if(isNaN(xMin) || isNaN(nPersonas)){
            throw "Bad Request";
        } 
```

- Iteramos con un ciclo **while** la variable _nPersonas_, iniciando desde _xMin_. En cada iteración revisamos si xMin es un valor posible de _**x**_.
```javascript
        while (xMin <= nPersonas) {
            (nPersonas % xMin) == 0 && sizesX.push(xMin); // Si el residuo entre nPersonas y xMin es igual a cero, lo guardamos en el array sizesX
            xMin++;
        }
```

- Si hubo alguna excepción lanzada en el bloque try, la retornamos desde la función **response()**.
```javascript
    } catch (error) {
        return response(400, error)
    }
```

- Finalmente, si no hay excepciones, retornamos los tamaños de _**x**_ hallados.
```javascript
    return response(200, sizesX.join())
```

- Función **response()** que nos permite retornar dinámicamente el código de respuesta, los posibles tamaños de x o en su defecto, alguna excepción encontrada. 
```javascript
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
```

### Codificación v1.0

- En nuestro método asíncrono, recibimos el _evento_ y lo convertimos a formato JSON.
```javascript
    const data = JSON.parse(event.body);
```

- Definimos las variables que serán usadas para resolver el ejercicio.
```javascript
    let gruposDeAmigos = data.groups; // Asignamos el string de grupos
    let nPersonas = 0; // Iniciamos con 0 la cantidad de personas presentes en todos los grupos
    let sizesBus = ''; // Aquí iremos guardando todos los posibles tamaños de x (bus que puede transportar a todos los grupos, cumpliendo con las condiciones)
    let capacidad = 0; // Iniciamos con 0 la capacidad mínima de pasajeros por bus
```

- Recorremos con un ciclo **for** el string de los grupos de amigos para hallar y guardar la _cantidad total de personas presentes en todos los grupos_ y la _capacidad mínima_ que puede tener un bus.
```javascript
    for(let grupo of gruposDeAmigos) {
        if (grupo !== ',' && !isNaN(grupo)){ // Validamos que el grupo no sea una coma y qie sea un número
            grupo = parseInt(grupo); // Convertimos el grupo a número
            nPersonas += grupo; // Vamos contando las personas grupo por grupo
            capacidad = grupo > capacidad ? grupo : capacidad; // Con un ternario aumentamos la capacidad mínima que puede tener un bus
        }
    }
```

- Iteramos con un ciclo **while** la _cantidad de personas encontrada en todos los grupos_, iniciando desde la _capacidad mínima_ de un bus. En cada iteración **validamos que el residuo de la división entre el total de personas y la capacidad mínima sea igual a cero** ya que, de no ser así, una o más personas no podrían ir sentadas.
```javascript
    while (capacidad <= nPersonas) {
        if(( nPersonas % capacidad ) == 0){
            sizesBus += `${capacidad},` // Vamos guardando los posibles tamaños de x (buses que cumplen las condiciones propuestas)
        }
        capacidad++; // Se aumenta la capacidad para proceder con la iteración del total de personas
    }
```

- Finalmente retornamos un código de respuesta satisfactoria y una cadena de texto JSON con los tamaños de _**x**_ hallados para cumplir con el _response_.
```javascript
    return {
        statusCode: 200,
        body: JSON.stringify(
            { 
                sizes: sizesBus.slice(0, -1) // Usamos slice para eliminar la última coma agregada con el ciclo while
            },
            null,
            2
        ),
    };
```

### Autor

Realizado con ❤️ por [IvanAndrade11](https://github.com/IvanAndrade11) ✔

### Agradecimientos

* Luisa Bedoya 👩‍💼
* Henry Jaraba 👷‍♂️

---
