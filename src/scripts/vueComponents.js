const items = [
    {
        id: 1,
        name: "Oříšková granola s jogurtem a sezónním ovocem",
        image: "./dist/assets/images/food/1.jpg",
        description: "",
        price: 125,
    },
    {
        id: 2,
        name: "Sladká snídaně",
        image: "./dist/assets/images/food/2.jpg",
        description: "2x mini croissant, 2x mini donut, džem, sezónní ovoce",
        price: 145,
    },
    {
        id: 3,
        name: "Slaná snídaně",
        image: "./dist/assets/images/food/3.jpg",
        description: "3x plněné mini bagety (šunka + sýr, chorizo + sýr, mozzarella + rajče), zeleninový salát, cottage",
        price: 199,
    }
    ,
    {
        id: 4,
        name: "Avokádový chléb s lososem",
        image: "./dist/assets/images/food/4.jpg",
        description: "",
        price: 79,
    }
    ,
    {
        id: 5,
        name: "Avokádový chléb s kozím sýrem",
        image: "./dist/assets/images/food/5.jpg",
        description: "",
        price: 69,
    }
];

const app = new Vue({
    el: "#app",
    delimiters: ['${', '}'],
    data: {
        menu: [],
        ordered: {},
        conclusion: [],
        sum: 0,
        showMore: false,
        date: "",
        deliveryInformation: {
            deliveryFirstName: "",
            deliveryLastName: "",
            deliveryAddress: "",
            deliveryEmail: "",
            deliveryPhone: "+420",
        },
        differentDelivery: false,
        billingInformation: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "+420",
            companyName: "",
            companyAddress: "",
            ico: "",
            dic: "",
        }
    },
    computed: {
        minDate: function() {
            let c = new Date(Date.now());
            c.setDate(c.getDate() + 1);
            if (c.getHours() > 18) {
                c.setDate(c.getDate() + 1);
            }
            this.date = new Date(c);
            return c;
        }
    },
    created: {
        
    },
    watch: {
        differentDelivery: function() {

            let suggestGlobal = new SMap.Suggest(document.getElementById("companyAddress"), {
                provider: new SMap.SuggestProvider({
                    updateParams: params => {
                        params.lang = "cs,en";
                        params.type = "country|municipality|street|address"
                    }
                })
            });
            
            suggest.addListener("suggest", suggestData => {
                console.log(suggestData)
            });

            if (this.differentDelivery) {
                let suggestLocal = new SMap.Suggest(document.getGetElementById("address"), {
                    provider: new SMap.SuggestProvider({
                        updateParams: params => {
                            params.lang = "cs,en";
                            params.locality = "Praha|cs";
                            params.type = "street|address"
                        }
                    })
                });
                
                suggestLocal.addListener("suggest", suggestData => {
                    console.log(suggestData)
                });
            }
            
        },
        menu: function() {
            this.menu.map(item => this.$set(this.ordered, item.id, 0));
        },
        conclusion: function() {
            this.sum = this.conclusion.reduce((sum, curr) => sum + curr[1], 0);
        },
        date: function() {
            const c = new Date(this.date);
            if (c.getDay() === 6) {
                c.setDate(c.getDate() + 2)
            } else if (c.getDay() === 7) {
                c.setDate(c.getDate() + 1)
            }
            return c;
        }
    },
    methods: {
        removeItem: function(id) {
            if (this.ordered[id] >= 0) {
                this.$set(this.ordered, id, this.ordered[id] -= 1);
            }

            this.menu.map((item, i) =>
                this.$set(this.conclusion, i, [
                `${this.ordered[i + 1]}x ${this.menu[i].name}`, this.menu[i].price * this.ordered[i + 1]
            ]));
        },
        addItem: function(id) {
            this.$set(this.ordered, id, this.ordered[id] += 1);
            this.menu.map((item, i) => 
                this.$set(this.conclusion, i, [
                `${this.ordered[i + 1]}x ${this.menu[i].name}`, this.menu[i].price * this.ordered[i + 1]
            ]));
        },
        onSubmit: function(e) {
            Object.keys(this.ordered).map(key =>
                this.$set(this.ordered, key, this.ordered[key] < 0 ? 0 : this.ordered[key])
            );
            let summary = {...this.billingInformation}
            summary.deliveryDate = this.date;
            summary.ordered = {...this.ordered}
            if (this.differentDelivery) {
                summary.differentDelivery = true;
                summary = {...this.deliveryInformation, ...summary}
            }

            if (this.sum > 0) {
                axios.post("/", {...summary});
                console.log({...summary});
            }
        }
    }
});

app.menu.push(...items);