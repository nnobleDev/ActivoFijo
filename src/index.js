
const {app,BrowserWindow,Menu,ipcMain} = require('electron');
const url=require('url');
const path= require('path');

if(process.env.NODE_ENV !=='production'){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname,'../node_modules','.bin','electron')
    });
}
//DECLARAMOS LAS VENTANAS
let mainWindow
let newRegistroWindow

//PERSISTENCIA
var Datastore = require('nedb'),
    db = new Datastore({filename: __dirname + '/data/example.dat', autoload: true});

//VENTANA PRINCIPAL
app.on('ready',()=>{
    mainWindow=new BrowserWindow({
        icon:path.join(__dirname,'data/ico32.png'),
        backgroundColor: '#312450',
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'),
        protocol:'file',
        slashes: true,        
    }));

    const mainMenu=Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on('close',()=>{
        app.quit();
    })
});

//VENTANA PARA NUEVO REGISTRO
function createNewRegistro(){
   newRegistroWindow= new BrowserWindow({
        width:500,
        height:780,
        title:'Nuevo activo fijo',
        icon:path.join(__dirname,'data/ico32.png'),
        webPreferences: {
            nodeIntegration: true
        }        
    });
    //newRegistroWindow.setMenu(null);
    newRegistroWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/new-equipo.html'),
        protocol:'file',
        slashes:true
    }));
    newRegistroWindow.on('closed',()=>{
        newRegistroWindow=null;
    })
}

//RECIBIR LOS DATOS DEL FORMULARIO

ipcMain.on('registro:af',(e,nf)=>{
    const nEquipo=nf.nEquipo;
    const desc=nf.desc;
    const orig=nf.orig;
    const nqe=nf.nqe;
    const pde=nf.pde;
    const dest=nf.dest;
    const nqr=nf.nqr;
    const pdr=nf.pdr;
    db.insert({nEquipo: nEquipo,desc:desc,orig:orig,nqe:nqe,pde:pde,dest:dest,nqr:nqr,pdr:pdr},(err,record)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(record);
    });
})

//TEMPLATE PARA EL MENU PRINCIPAL
const templateMenu=[
    {
        label:'Archivo',
        submenu:[
            {
                label:'Nuevo activo fijo',
                accelerator:'Ctrl+n',
                click(){
                    createNewRegistro();
                }
            },
            {
                label:'Salir',
                accelerator:'Ctrl+x',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'Registros',
        submenu:[
            {
                label:'Buscar por n° de equipo',
                accelerator:'Ctrl+b',
                click(){

                }
            },
            {
                label:'Listado de registros',
                accelerator:'Ctrl+l',
                click(){

                }
            }
        ]
    }
]
//DEVTOOLS
if(process.env.NODE_ENV !=='production'){
    templateMenu.push({
        label:'Devtools',
        submenu:[
            {
                label:'Show/hide devTools',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}