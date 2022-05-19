## Prueba Desarrollador BackEnd 

![](https://via.placeholder.com/336x35/1387ae/fff?text=Banco+de+Occidente)

---

### Descripción
---
Se plantea desarrollar una solución a un problema lógico, el cuál debe implementar una función **AWS Lambda** en _Java_ o _Node JS_. Esta debe exponerse como **API REST** a través  del servicio **AWS API GATEWAY**.

### Problema a resolver
---
>Hay _**n**_ grupos de amigos y cada grupo es numerado del **1** al _**n**_. EL _**ith**_ grupo contiene _**ai**_ personas.

>Todos viven cerca de una parada de bus, y solo un bus funciona en esa ruta. EL bus vacío llega a la parada y todos los grupos quieren viajar en el bus. 
>Sin embargo, cada grupo de amigos no quiere separarse. Así que entran al bus solo si el bus puede llevar todo el grupo.
>
>Además, los grupos no quieren cambiar su posición relativa mientras viajan. En otras palabras, el grupo 3 no puede viajar en el bus, a menos que el grupo 1 y el 2 ya hayan viajado, adicionalmente es necesario que todos estén sentados dentro del autobús en este momento, lo que quiere decir que un bus de capacidad _**x**_ solo puede transportar _**x**_ personas simultaneamente.
>
>Encuentre todos los posibles tamaños de _**x**_ del bus para que pueda transportar a todos los grupos, cumpliendo con las condiciones anteriores, y cada vez que el bus salga de la estación, no haya sillas vacías en el bus (es decir, el número total de personas presentes dentro del bus es igual a _**x**_).

### Arquitectura
---
| ![Data](https://ps.w.org/amazon-polly/assets/icon-256x256.png?rev=2183954) | ![Data](https://images.opencollective.com/goserverless/93e050b/logo/256.png) |
| ---      | ---       |
| **Lambda:** prueba-backend-dev-solution | Deployment con **Serverless Framework** |
| **API Gateway:** dev-prueba-backend |

**Punto de enlace de API:** https://rrhgs3xba1.execute-api.us-east-1.amazonaws.com/dev/

### Examples
---
#### Request
```
{
    "groups" : "1,2,1,1,1,2,1,3"
}
```
#### Response
```
{
    "sizes" : "3,4,6,12"
}
```

### Desarrollo de la solución
---
#### Aprovisionamiento

- Se creó una **cuenta** en AWS personal con acceso a los servicios necesarios. 

- Desde la consola de AWS se añadió un nuevo usuario de **IAM** con permisos _AdministratorAccess_ generando  el ID de clave de acceso.

- Se instaló **AWS Command Line Interface** y se ejecutó el siguiente comando para configurar las credenciales de accesso AWS:
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
[========]

### Autor

Realizado con ❤️ por [IvanAndrade11](https://github.com/IvanAndrade11) ✔

### Agradecimientos

* Luisa Bedoya 👩‍💼
* Henry Jaraba 👷‍♂️

---
