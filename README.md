# Software Studio 2024 Spring Assignment 2

## Student ID : 112062129 Name : 游松澤

### Scoring

|**Basic Component**|**Score**| **Check** |
|:-:|:-:|:---------:|
|Complete Game Process|5%|     Y     |
|Basic Rules|55%|     Y     |
|Animations|10%|     Y     |
|Sound Effects|10%|     Y     |
|UI|10%|     Y     |

|**Advanced Component**|**Score**| **Check** |
|:-:|:-:|:---------:|
|firebase deploy|5%|     Y     |
|Leaderboard|5%|     N     |
|Offline multi-player game|5%|     N     |
|Online multi-player game|10%|     N     |
|Others [name of functions]|1-10%|     N     |

---

## Basic Components Description : 
1. Complete Game Process [5%]:
   - Start menu 
   - Level select 
   - Game view(including game start / game over)
   - You need to control the game process according to current game & player status

2. World map : [15%]
    - The world map is a 2D map that contains the player, enemies, question blocks, backside boxs and other objects.
    - The world map has correct physics properties, such as objects fall due to gravity, two different objects can collide with each other correctly, etc.
    - The background and camera can move according to the player's position.
    - The world map has a boundary, and the player cannot move out of the boundary.
    - The world map has a flag at the end.

2. Player : [20%]
   - The player has three life points at the beginning.
   - The player has correct physics properties such as fall and jump due to gravity, two different objects can collide with each other correctly.
   - The player can move left, right, jump by pressing LEFT, RIGHT, UP in your keyboard.
   - When the player touches the enemies or out of deadBounds, the number of its life will decrease.
   - The player can attack enemies by stepping on them and add 150 points.
   - The player can collect coins and add 100 points.
   - When the player dies, it can reborn at the initial position.
   - When the player reaches the flag, the stage is cleared.
   - When the player has no life, the game is over.

3. Enemies : [15%]
   - The enemies are placed in the world map, including flowers and goombas.
      - The enemies have correct physics properties.
      - The enemies can move left and right.
      - The enemies can kill the player when they touch the player.
      - The enemies will die only when player hits on their heads.

4. Question Blocks : [5%]
    - The question blocks can be hit by the player and add 100 points.
    - The question blocks can be used only once.
   
5. Animations : [10%]
    - Player has walk & jump animations (5%)
    - Enemies Animation:
      - Goombas walk and die animations (4%)
      - Flowers animations (1%)
      - 
6. Sound effects : [10%]
   - BGM in stage1 (2%)
   - Player Jump & die sound effects (3%)
   - Player attack, eat coins, gameOver, stageClear, enemy die sound effects (each for 1%, up to 5%)

7. UI : [10%]
   - Player life  (3%)
   - Player score  (5%)
   - Timer (2%)


## Advanced Component Description : (X)

1. Firebase deploy : [5%]

# Firebase page link (if you deploy) (X)

    https://jymario-vaclis.web.app/