const Menu = {
    show(){
        document.querySelector('.menu')
            .classList
            .toggle('active')
    
    
        document.querySelector('.icon-toggle')
            .classList
            .toggle('active')
        } ,

        hide(){
            document.querySelector('.menu')
            .classList
            .remove('active')
        
            document.querySelector('.icon-toggle')
            .classList
            .remove('active')
        
        } ,

        search(event){
            event.preventDefault()
            
                Table.clearTable()
                Menu.hide()
                SearchedItem = document.getElementById('search').value.toLowerCase()
                 Products.all
                   .filter(item => item.label.toLowerCase().indexOf(SearchedItem) !== -1)
                   .forEach(Table.addItem)    
            } ,
    }

const Notifications = {
    
    ShopCart : document.getElementById('shop-cart') ,
    Bell : document.getElementById('bell') ,

    ShowCartNumber() {
        this.clearNotifications(Notifications.ShopCart)
        const p = document.createElement('p')
        p.innerHTML = Products.all.length
        Notifications.ShopCart.appendChild(p)
    } ,


    clearNotifications(Icon){
        Icon.innerHTML = ''
    } ,

    ShowCircle(){
        this.clearNotifications(Notifications.Bell)
        const div = document.createElement('div')
        Notifications.Bell.appendChild(div)
    } ,

}

const Assets = {
   
    clearAll() {
        Products.remove(0 , Products.all.length)
    },

    
    getValue(){
            option = document.getElementById('sort').value
        
            return option
        } ,
    
    sort(option){
        if(option == 'HP'){
            Products.all.sort((a , b) => b.price - a.price)  
            
                App.reload()
            }
            
            if(option == 'LP'){
                Products.all.sort((a , b) => a.price - b.price)  
                
                App.reload()
            }
    } ,


    submit(event) {
        event.preventDefault()
        Assets.sort(Assets.getValue())
        
        }


}

const Modal = {
    open(){
        document.querySelector('.overlay')
            .classList
            .add('active')   
    },
        
    close(){
        document.querySelector('.overlay')
            .classList
            .remove('active')   
    }
}


const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("Shopping List")) || []
    },

    set(product){
        return localStorage.setItem("Shopping List" , JSON.stringify(product))
    }

}


const Products = {
    
    all : Storage.get() ,


    add(product){
        Products.all.push(product)
        
        Assets.sort(Assets.getValue())

        App.reload()
    

    } ,

    remove(index , qnt = 1) {
        Products.all.splice(index , qnt)
    
        App.reload()
    
    } ,

    total() {
        let total = 0
        Products.all.forEach(item => {
            total += item.price
        })
    
        return total
    
    }
}



const Table = {
    TableItems : document.querySelector('#table-products tbody') ,

    addItem(item , index) {
        const tr = document.createElement('tr')
        tr.innerHTML = Table.addContent(item , index)
        tr.dataset.index = index

        Table.TableItems.appendChild(tr)
    } ,

    addContent(item , index){
        const price = Format.Currency(item.price)
    
        const html = `
        <td>${item.label}</td>
        <td>${price}</td>
        <td><i class="fas fa-times" onclick="Products.remove(${index})"></i></td>`
    
    
        return html
    } ,

    updateTable(){
        document.querySelector('#total')
            .innerHTML = Format.Currency(Products.total())
    } ,

    clearTable() {
        Table.TableItems.innerHTML = ''
    }

}


const Format = {
    Price(value){

        value = Number(value) 
        
        return value
    } ,
    
    
    Currency(value){
    
        value = Number(value)
 
        value = value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })
    
            return value

    }
}

const Form = {
    label : document.querySelector('input#label'),
    price : document.querySelector('input#price'),

    getValues(){
        return {
            label: Form.label.value ,
            price: Form.price.value
        }    
    } ,

    validateFields(){
        const { label , price} = Form.getValues()
    
        if(label.trim() === "" || price.trim() === ""){
            throw new Error("Please  , fill in all the fields")
        }
    
        if(price < 0) {
            throw new Error("Only positive values are allowed")
        }
    } ,

    formatValues() {
        let { label , price } = Form.getValues()
        
        price = Format.Price(price)

        return {
            label, 
            price
        }
    },

    clearFields(){
        Form.label.value = ""
        Form.price.value = ""
    } , 

    submit(event){
        event.preventDefault()

        try{
            Form.validateFields()
            const product = Form.formatValues()
            Products.add(product)
            Form.clearFields()
            Modal.close()
        } catch(error){
            alert(error.message)
        }
    }


}

const App = {
    init(){
        Products.all.forEach(Table.addItem)
    
        Notifications.ShowCartNumber()
    
        Table.updateTable()
        
        Storage.set(Products.all)
    } ,

    reload(){
        Table.clearTable()
        
        Notifications.ShowCircle()
        
        App.init()
        
    }

}

App.init()