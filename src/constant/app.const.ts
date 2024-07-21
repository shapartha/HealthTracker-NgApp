export class AppConstant {
    APP_VERSION: string = "3.0.220724";
    static RUPEE_SYMBOL: string = "₹";
    static MONTH: any = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    };
    HOME_TABS: any[];
    static BLOOD_PRESSURE_VALUE = {
        GOOD : {
            SYS: [
                {
                    HIGH: 129,
                    LOW: 110
                }
            ],
            DIA: [
                {
                    HIGH: 89,
                    LOW: 70
                }
            ],
            PULSE: [
                {
                    HIGH: 100,
                    LOW: 70
                }
            ]
        },
        AVG : {
            SYS: [
                {
                    HIGH: 159,
                    LOW: 130
                },
                {
                    HIGH: 109,
                    LOW: 95
                }
            ],
            DIA: [
                {
                    HIGH: 105,
                    LOW: 90
                },
                {
                    HIGH: 69,
                    LOW: 60
                }
            ],
            PULSE: [
                {
                    HIGH: 129,
                    LOW: 101
                },
                {
                    HIGH: 69,
                    LOW: 60
                }
            ]
        },
        BAD : {
            SYS: [
                {
                    HIGH: 999,
                    LOW: 160
                },
                {
                    HIGH: 94,
                    LOW: 0
                }
            ],
            DIA: [
                {
                    HIGH: 999,
                    LOW: 106
                },
                {
                    HIGH: 59,
                    LOW: 0
                }
            ],
            PULSE: [
                {
                    HIGH: 999,
                    LOW: 130
                },
                {
                    HIGH: 59,
                    LOW: 0
                }
            ]
        }
    };
    static BLOOD_SUGAR_VALUE = {
        GOOD : {
            FBS: [
                {
                    HIGH: 120,
                    LOW: 80
                }
            ],
            PP: [
                {
                    HIGH: 140,
                    LOW: 110
                }
            ]
        },
        AVG : {
            FBS: [
                {
                    HIGH: 150,
                    LOW: 121
                },
                {
                    HIGH: 79,
                    LOW: 70
                }
            ],
            PP: [
                {
                    HIGH: 169,
                    LOW: 141
                },
                {
                    HIGH: 109,
                    LOW: 80
                }
            ]
        },
        BAD : {
            FBS: [
                {
                    HIGH: 999,
                    LOW: 151
                },
                {
                    HIGH: 69,
                    LOW: 0
                }
            ],
            PP: [
                {
                    HIGH: 999,
                    LOW: 170
                },
                {
                    HIGH: 79,
                    LOW: 0
                }
            ]
        }
    };

    constructor() {
        this.HOME_TABS = [
            { name: 'Blood Pressure', path: 'home'},
            { name: 'Blood Sugar', path: 'bSugar'}
        ];
    }
}