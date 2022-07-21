const fs = require('fs/promises');



class CFile {

    constructor(_name){

        this.name=_name;

        this.values=[];

    }
    async sync(){
        try {
            await fs.writeFile(this.name,JSON.stringify(this.values, null, 2));
        } catch (error) {
            console.log(error.message);
        }
    }

    generateId(){
        if (this.values.length===0){
            return 0
        }else{
            const allID = this.values.map((item)=>item.id);
            return (Math.max(...allID) + 1);
        }
    }

    async save(obj){
        try {
            obj.id = this.generateId();
            this.values.push(obj);
            return obj.id;
        } catch (error) {
            console.log(error.message);
        }
    }

    async open(){

        try {

            const valuesFiles = await fs.readFile(this.name,'utf-8');

            this.values = JSON.parse(valuesFiles);

        } catch (error) {

            this.values = [];

            await fs.promises.writeFile(this.name,JSON.stringify([]));
        }
    }

    async getAll(){
        try {
            return this.values;
        } catch (error) {
            console.log(error.message);
        }
    }

    async  getById(id) {
        try{
            const products= JSON.parse(id);   
            return this.values.find(c => c.id === products);
        
        } catch (error) {
        console.log(error.message);
        }
    }   

    async deleteById(id){
    try{             

            const filtered = this.values.filter(el => el.id !== id);
            this.values = filtered;
            this.saveAll(filtered);
               
        } catch (error) {
        console.log(error.message);
        }

    };

    async deleteAll(){
        try{ 
            await fs.writeFile(this.name,JSON.stringify([]));
                            
            } catch (error) {
                console.log(error.message);
            }
        } 
        async update(obj){
            try {

                this.values.push(obj);
                return obj.id;
            } catch (error) {
                console.log(error.message);
            }
        }
        
        async saveAll (data) {
            try {
                
                await fs.writeFile(this.name, JSON.stringify(data, null, 2) ,'utf-8')
        } catch (error) {
                 console.log(error.message);
        }
    }
    
}  

module.exports = CFile
