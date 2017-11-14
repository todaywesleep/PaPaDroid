export class Utils {
    static cpuInfoParser(info) {
        return Utils.prepareNameFromArray(Utils.cutArray(info))
    }

    static cutArray(separatorSlashN) {
        return separatorSlashN.split('\n');
    }

    static prepareNameFromArray(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].contains('Hardware')) {
                return array[i].split(':')[1];
            }
        }
    }

    static parseCpuStats(string) {
        return string.split('\n');
    }

    static computeAllProcesses(fromArray) {
        let sum = 0;
        fromArray.map(function (item) {
            sum += parseInt(item);
        });

        return sum;
    }

    static kbTOmb(kbytes, kilos) {
        kbytes = kbytes.replace(/\D/g, '');
        if (kilos) {
            return Math.floor(kbytes / 1024);
        } else {
            return Math.floor(kbytes / 10024);
        }
    }
}