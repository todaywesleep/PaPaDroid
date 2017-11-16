const Realm = require('realm');

export class DataBase {
    static readWrites(){
        let realm = new Realm({schema: [BatteryScheme]});
        let battery = realm.objects('Battery');
    }

    static createWrite(){
        Realm.open({schema: [BatteryScheme]})
            .then(realm => {
                realm.write(() => {
                    realm.create('Battery',{
                        lastChargeDate: new Date(),
                        averageChargingTime: 2.3,
                    });
                })
            })
    }
}

const BatteryScheme = {
    name: 'Battery',
    properties: {
        lastChargeDate: 'date',
        averageChargingTime: 'double',
    }
};