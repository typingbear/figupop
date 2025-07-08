export const figures = [
    {
        "id": "bear",
        "name": "Bear",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 154,
                "height": 132
            },
            "mode1": {
                "width": 162,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "buffalo",
        "name": "Buffalo",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 183,
                "height": 152
            },
            "mode1": {
                "width": 184,
                "height": 154
            }
        },
        "reactions": []
    },
    {
        "id": "cat",
        "name": "Cat",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 735,
                "height": 824
            },
            "mode1": {
                "width": 736,
                "height": 736
            },
            "mode2": {
                "width": 736,
                "height": 939
            }
        },
        "reactions": []
    },
    {
        "id": "cat2",
        "name": "Cat2",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 300,
                "height": 451
            }
        },
        "reactions": []
    },
    {
        "id": "chick",
        "name": "Chick",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            },
            "mode2": {
                "width": 128,
                "height": 145
            },
            "mode3": {
                "width": 128,
                "height": 145
            }
        },
        "reactions": [
            {
                "mode": "*",
                "with": "bear",
                "result": "mode1"
            },
            {
                "mode": "mode1",
                "with": "frog",
                "result": "egg.base"
            },
            {
                "mode": "mode2",
                "with": "egg",
                "result": "mode3",
                "sound": "reaction.mp3"
            }
        ]
    },
    {
        "id": "cow",
        "name": "Cow",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 145,
                "height": 128
            },
            "mode1": {
                "width": 186,
                "height": 128
            },
            "super": {
                "width": 268,
                "height": 162
            }
        },
        "reactions": []
    },
    {
        "id": "crocodile",
        "name": "Crocodile",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "dog",
        "name": "Dog",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 157
            },
            "mode1": {
                "width": 128,
                "height": 161
            },
            "mode2": {
                "width": 128,
                "height": 145
            }
        },
        "reactions": []
    },
    {
        "id": "dog1",
        "name": "Dog1",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 502,
                "height": 611
            },
            "mode1": {
                "width": 477,
                "height": 644
            },
            "mode3": {
                "width": 554,
                "height": 557
            }
        },
        "reactions": []
    },
    {
        "id": "dog2",
        "name": "Dog2",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 496,
                "height": 527
            }
        },
        "reactions": []
    },
    {
        "id": "duck",
        "name": "Duck",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "egg",
        "name": "Egg",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 736,
                "height": 834
            },
            "mode1": {
                "width": 736,
                "height": 571
            },
            "mode2": {
                "width": 736,
                "height": 736
            }
        },
        "reactions": [
            {
                "mode": "base",
                "with": "rock",
                "result": "mode1"
            },
            {
                "mode": "mode1",
                "with": "fire",
                "result": "mode2",
                "sound": "reaction.mp3"
            }
        ]
    },
    {
        "id": "elephant",
        "name": "Elephant",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 183,
                "height": 154
            },
            "mode1": {
                "width": 184,
                "height": 138
            },
            "super": {
                "width": 163,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "fire",
        "name": "Fire",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 736,
                "height": 736
            }
        },
        "reactions": []
    },
    {
        "id": "flag",
        "name": "Flag",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 680,
                "height": 678
            }
        },
        "reactions": []
    },
    {
        "id": "frog",
        "name": "Frog",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 130,
                "height": 144
            },
            "golden": {
                "width": 129,
                "height": 139
            },
            "mode1": {
                "width": 138,
                "height": 128
            }
        },
        "reactions": [
            {
                "mode": "base",
                "with": "bear",
                "result": "mode1"
            },
            {
                "mode": "mode1",
                "with": "chick",
                "result": "golden"
            }
        ]
    },
    {
        "id": "giraffe",
        "name": "Giraffe",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 154,
                "height": 162
            },
            "mode1": {
                "width": 162,
                "height": 161
            }
        },
        "reactions": []
    },
    {
        "id": "goat",
        "name": "Goat",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 184,
                "height": 171
            },
            "mode1": {
                "width": 184,
                "height": 171
            }
        },
        "reactions": []
    },
    {
        "id": "gorilla",
        "name": "Gorilla",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "hand",
        "name": "Hand",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 450,
                "height": 600
            }
        },
        "reactions": []
    },
    {
        "id": "hippo",
        "name": "Hippo",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 154,
                "height": 128
            },
            "mode1": {
                "width": 166,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "horse",
        "name": "Horse",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 141
            },
            "mode1": {
                "width": 128,
                "height": 143
            }
        },
        "reactions": []
    },
    {
        "id": "hotdog",
        "name": "Hotdog",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 521,
                "height": 643
            }
        },
        "reactions": []
    },
    {
        "id": "man",
        "name": "Man",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 736,
                "height": 938
            }
        },
        "reactions": []
    },
    {
        "id": "monkey",
        "name": "Monkey",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 174,
                "height": 128
            },
            "mode1": {
                "width": 174,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "moose",
        "name": "Moose",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 269,
                "height": 162
            }
        },
        "reactions": []
    },
    {
        "id": "narwhal",
        "name": "Narwhal",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 138,
                "height": 155
            },
            "mode1": {
                "width": 146,
                "height": 145
            }
        },
        "reactions": []
    },
    {
        "id": "owl",
        "name": "Owl",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 128,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "panda",
        "name": "Panda",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 174,
                "height": 128
            },
            "mode1": {
                "width": 178,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "parrot",
        "name": "Parrot",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "penguin",
        "name": "Penguin",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 140,
                "height": 128
            },
            "mode1": {
                "width": 147,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "pig",
        "name": "Pig",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 144,
                "height": 128
            },
            "mode1": {
                "width": 170,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "rabbit",
        "name": "Rabbit",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 176
            },
            "mode1": {
                "width": 128,
                "height": 176
            }
        },
        "reactions": []
    },
    {
        "id": "rhino",
        "name": "Rhino",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 154,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "rock",
        "name": "Rock",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 640,
                "height": 640
            }
        },
        "reactions": []
    },
    {
        "id": "shark",
        "name": "Shark",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 736,
                "height": 736
            },
            "mode1": {
                "width": 736,
                "height": 736
            }
        },
        "reactions": [
            {
                "mode": "base",
                "with": "shoe",
                "result": "mode1"
            }
        ]
    },
    {
        "id": "shoe",
        "name": "Shoe",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 626,
                "height": 626
            }
        },
        "reactions": []
    },
    {
        "id": "sloth",
        "name": "Sloth",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 129,
                "height": 128
            },
            "mode1": {
                "width": 128,
                "height": 128
            }
        },
        "reactions": []
    },
    {
        "id": "snake",
        "name": "Snake",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 128,
                "height": 142
            }
        },
        "reactions": []
    },
    {
        "id": "sun",
        "name": "Sun",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 736,
                "height": 736
            }
        },
        "reactions": []
    },
    {
        "id": "tree",
        "name": "Tree",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 400,
                "height": 500
            }
        },
        "reactions": []
    },
    {
        "id": "walrus",
        "name": "Walrus",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 128,
                "height": 138
            },
            "mode1": {
                "width": 129,
                "height": 134
            }
        },
        "reactions": []
    },
    {
        "id": "water",
        "name": "Water",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 626,
                "height": 626
            }
        },
        "reactions": []
    },
    {
        "id": "whale",
        "name": "Whale",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 138,
                "height": 154
            },
            "mode1": {
                "width": 148,
                "height": 157
            }
        },
        "reactions": []
    },
    {
        "id": "zebra",
        "name": "Zebra",
        "kind": "prime",
        "desc": "",
        "modes": {
            "base": {
                "width": 128,
                "height": 141
            }
        },
        "reactions": []
    }
];
