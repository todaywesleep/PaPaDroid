import Realm from 'realm';

export class DataBase {
    static readWrites() {
        let realm = new Realm({schema: [BatteryScheme]});
        let battery = realm.objects('Battery');
    }

    static readWriteFor(type) {
        let realm;

        switch (type) {
            case 'Battery':
                realm = new Realm({schema: [BatteryScheme]});
                break;
            case 'RAM':
                realm = new Realm({schema: [RAMScheme]});
                break;
            case 'Storage':
                realm = new Realm({schema: [StorageScheme]});
                break;
        }

        let allObjects = realm.objects(type);
        return allObjects;
    }

    static checkForNilOrUndef(item) {
        return item !== undefined && item !== 0;
    }

    static createBatteryWrite(isCharging, date, sender) {
        let batteryInf = DataBase.checkForNilOrUndef(DataBase.returnLastBlock('Battery')) ? DataBase.returnLastBlock('Battery') : {
            lastChargeDate: new Date(),
            averageChargingTime: 0,
            isCharging: false,
            boofTime: 0,
        };
        let chargeTime = 0;
        let newDate;
        let avgChargeTime = 0;

        if (isCharging === false) {
            chargeTime = DataBase.checkForNilOrUndef(batteryInf.boofTime) ? batteryInf.boofTime : 0;
            let needDivide = chargeTime !== 0;
            avgChargeTime = batteryInf.averageChargingTime !== undefined ? (batteryInf.averageChargingTime + chargeTime / (needDivide ? 2 : 1)) : 0;
            newDate = DataBase.checkForNilOrUndef(batteryInf.lastChargeDate) ? new Date(batteryInf.lastChargeDate) : new Date();
            chargeTime = 0;
        }
        if (isCharging) {
            chargeTime = DataBase.checkForNilOrUndef(batteryInf.boofTime) ? batteryInf.boofTime : 0;
            chargeTime += sender === 'afk' ? 15 : 1;
            avgChargeTime = DataBase.checkForNilOrUndef(batteryInf.averageChargingTime) ? batteryInf.averageChargingTime : 0;
            newDate = new Date();
        }

        let newObject = {
            lastChargeDate: newDate,
            averageChargingTime: avgChargeTime,
            isCharging: isCharging,
            boofTime: chargeTime,
        };

        DataBase.refillRealm('Battery', newObject);
    }

    static createStorageWrite(totalStorage, freeStorage) {
        let storageInf = DataBase.checkForNilOrUndef(DataBase.returnLastBlock('Storage')) ? DataBase.returnLastBlock('Storage') : {
            freePercentage: 0,
            totalSpace: 0
        };

        let freePercentage = Math.floor(freeStorage / Math.floor(totalStorage / 100));
        let percentage = DataBase.checkForNilOrUndef(storageInf.freePercentage) ? (storageInf.freePercentage + freePercentage) / 2 : freePercentage;

        let newObject = {
            freePercentage: percentage,
            totalSpace: totalStorage,
        };

        DataBase.refillRealm('Storage', newObject)
    }

    static createRAMWrite(totalRam, freeRam) {
        let storageInf = DataBase.checkForNilOrUndef(DataBase.returnLastBlock('RAM')) ? DataBase.returnLastBlock('RAM') : {
            freePercentage: 0,
            totalSpace: 0
        };

        let freePercentage = Math.floor(freeRam / Math.floor(totalRam / 100));
        let percentage = DataBase.checkForNilOrUndef(storageInf.freePercentage) ? (storageInf.freePercentage + freePercentage) / 2 : freePercentage;

        let newObject = {
            freePercentage: percentage,
            totalSpace: totalRam,
        };

        DataBase.refillRealm('RAM', newObject)
    }

    static refillRealm(type, newObject) {
        let realm;

        switch (type) {
            case 'Battery':
                realm = new Realm({schema: [BatteryScheme]});
                break;
            case 'RAM':
                realm = new Realm({schema: [RAMScheme]});
                break;
            case 'Storage':
                realm = new Realm({schema: [StorageScheme]});
                break;
        }

        let allObjects = realm.objects(type);
        realm.write(() => {
            realm.delete(allObjects);
        });
        realm.write(() => {
            realm.create(type, newObject);
        });

        realm.close();
    }

    static returnLastBlock(type) {
        let realm;

        switch (type) {
            case 'Battery':
                realm = new Realm({schema: [BatteryScheme]});
                break;
            case 'RAM':
                realm = new Realm({schema: [RAMScheme]});
                break;
            case 'Storage':
                realm = new Realm({schema: [StorageScheme]});
                break;
        }

        let allObjects = JSON.parse(JSON.stringify(realm.objects(type)));
        realm.close();

        return allObjects[0];
    }

    static writeAll(isCharging, date, sender, totalStorage, freeStorage, totalRam, freeRam) {
        DataBase.createBatteryWrite(isCharging, date, sender);
        DataBase.createStorageWrite(totalStorage, freeStorage);
        DataBase.createRAMWrite(totalRam, freeRam);
    }

    static migration() {
        Realm.open({
            schema: [BatteryScheme],
            schemaVersion: 0,
            migration: (oldRealm, newRealm) => {
                // only apply this change if upgrading to schemaVersion 1
                const oldObjects = oldRealm.objects('Battery');
                const newObjects = newRealm.objects('Battery');

                for (let i = 0; i < oldObjects.length; i++) {
                    newObjects.deleteAll();
                }
                for (let i = 0; i < oldObjects.length; i++) {
                    oldObjects.deleteAll();
                }
            }
        });
    }
}

const BatteryScheme = {
    name: 'Battery',
    properties: {
        lastChargeDate: 'date',
        averageChargingTime: 'double',
        isCharging: 'bool',
        boofTime: 'int',
    }
};

const StorageScheme = {
    name: 'Storage',
    properties: {
        freePercentage: 'int',
        totalSpace: 'int',
    }
};

const RAMScheme = {
    name: 'RAM',
    properties: {
        freePercentage: 'int',
        totalSpace: 'int',
    }
};