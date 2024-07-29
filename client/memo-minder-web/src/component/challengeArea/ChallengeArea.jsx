import React, { useState, useEffect, useRef, useMemo } from "react";
import "./ChallengeArea.css";
import Popup from '../popup/Popup';

// Character image
const imagesRight = ['char_right1.png', 'char_right2.png', 'char_right3.png'];
const imagesLeft = ['char_left1.png', 'char_left2.png', 'char_left3.png'];
const AttackRight = ['rightAtk1.png', 'rightAtk2.png', 'rightAtk3.png', 'rightAtk4.png', 'rightAtk6.png', 'rightAtk7.png', 'rightAtk8.png'];
const AttackLeft = ['leftAtk1.png', 'leftAtk2.png', 'leftAtk3.png', 'leftAtk4.png', 'leftAtk6.png', 'leftAtk7.png', 'leftAtk8.png'];
const stickAttackRight = ['rightStick1.png', 'rightStick2.png', 'rightStick3.png'];
const stickAttackLeft = ['leftStick1.png', 'leftStick2.png', 'leftStick3.png'];
const swordAttackRight = ['rightSword1.png', 'rightSword2.png', 'rightSword3.png'];
const swordAttackLeft = ['leftSword1.png', 'leftSword2.png', 'leftSword3.png'];
const lightingAnimationFrames = ['lighting1.png', 'lighting2.png', 'lighting3.png', 'lighting4.png', 'lighting5.png'];
// Boss image
const wolfImagesLeft = ['wolfgoleft1.png', 'wolfgoleft2.png'];
const wolfImagesRight = ['wolfgoright1.png', 'wolfgoright2.png'];
const catImagesLeft = ['catgoleft1.png', 'catgoleft2.png'];
const catImagesRight = ['catgoright1.png', 'catgoright2.png'];
// Define the level data
const levels = [
  { bossPosition: 95, bossHealth: 100, bossImages: wolfImagesLeft }, // Level 1
];

function ChallengeArea({ level, WolfCoinReward, CatCoinReward }) {
  // initial state
  const [position, setPosition] = useState(5); 
  const [health, setHealth] = useState(100);
  const [currentImage, setCurrentImage] = useState('char_right1.png');
  const [direction, setDirection] = useState('right');
  // get bought items
  const [boughtItems, ] = useState(() => {
    const saved = localStorage.getItem('boughtItems');
    return saved ? JSON.parse(saved) : {};
  });
  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
  // image index for animation
  const imageIndex = useRef(0);
  // magic state
  const [isMagicAttack, setIsMagicAttack] = useState(false);
  // state for mouse position for apply magic attack
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // magic attack lighting
  const [showLighting, setShowLighting] = useState(false);
  const [lightingPosition, setLightingPosition] = useState({ x: 0, y: 0 });
  const [currentLightingImage, setCurrentLightingImage] = useState('');
  const lightingAnimationIndex = useRef(0);
  // Collision detection function
  const isBossInRange = () => {
    const distance = Math.abs(bossPosition - position);
    const attackRange = 10; // Adjust this value based on your game's scale
    return distance <= attackRange;
  };
  // popup
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
  };
  // boss state
  const [currentLevel, setCurrentLevel] = useState(0); // Current level index
  const [bossPosition, setBossPosition] = useState(levels[currentLevel].bossPosition); // Initial boss position
  const [bossHealth, setBossHealth] = useState(levels[currentLevel].bossHealth); // Boss health state
  const [currentBossImage, setCurrentBossImage] = useState(levels[currentLevel].bossImages[0]); // Initial boss image
  const bossImageIndex = useRef(0);
  // Add boss attack power
  const [bossAttackCooldown, setBossAttackCooldown] = useState(false); 
  const bossCooldownTime = 1000; 
  // Define boss configurations
  const bossConfigurations = useMemo(() => ({
    wolf: {
      bossPosition: 95,
      bossHealth: 100,
      bossImagesLeft: wolfImagesLeft,
      bossImagesRight: wolfImagesRight,
      bossSpeed: 0.3, 
      bossAttackPower: 5, 
    },
    cat: {
      bossPosition: 95, 
      bossHealth: 100, 
      bossImagesLeft: catImagesLeft,
      bossImagesRight: catImagesRight,
      bossSpeed: 0.5, 
      bossAttackPower: 10, 
    },
  }), []);
  // Condition for unlock boss
  const isWolfChallengeAvailable = level >= 5; // unlock wolf
  const isCatChallengeAvailable = level >= 10; // unlock cat

  // New state to track if the game has started
  const [gameStarted, setGameStarted] = useState(false);
  const [isChallengeAvailable, setIsChallengeAvailable] = useState(false);
  // challenge attempt
  const [selectedBoss, setSelectedBoss] = useState("wolf");
  const [attempts, setAttempts] = useState(() => {
    const savedAttempts = localStorage.getItem('challengeAttempts');
    let attemptsData = savedAttempts ? JSON.parse(savedAttempts) : {};
    // Ensure both 'wolf' and 'cat' keys exist with a default structure
    const defaultAttemptStructure = { count: 1, date: new Date().toDateString() };
    attemptsData.wolf = attemptsData.wolf || defaultAttemptStructure;
    attemptsData.cat = attemptsData.cat || defaultAttemptStructure;
    // Update if it's a new day
    const today = new Date().toDateString();
    if (attemptsData.wolf.date !== today) {
      attemptsData.wolf = { count: 1, date: today };
    }
    if (attemptsData.cat.date !== today) {
      attemptsData.cat = { count: 1, date: today };
    }
    return attemptsData;
  });
 
  

  /*---- set challenge attempts start ----*/
  useEffect(() => {
    localStorage.setItem('challengeAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const startChallenge = () => {
    if (attempts[selectedBoss].count > 0) {
      const selectedBossConfig = bossConfigurations[selectedBoss];
      setBossPosition(selectedBossConfig.bossPosition);
      setBossHealth(selectedBossConfig.bossHealth);
      setCurrentBossImage(selectedBossConfig.bossImagesLeft[0]);
      setAttempts(prev => ({
        ...prev,
        [selectedBoss]: { count: prev[selectedBoss].count - 1, date: new Date().toDateString() }
      }));
      setGameStarted(true);
      // Determine the reward based on the boss before the challenge starts
      const initialReward = selectedBoss === "wolf" ? '50' : '80';
      setReward(initialReward); // Set initial reward based on selected boss
    }
  };
  // Adjust useEffect for boss selection to update reward accordingly
  useEffect(() => {
    // Update the reward based on selectedBoss whenever it changes
    const newReward = selectedBoss === "wolf" ? '50' : '80';
    setReward(newReward);
  }, [selectedBoss]);
  

  useEffect(() => {
    // Checks if the challenge is available based on the selectedBoss
    setIsChallengeAvailable(attempts[selectedBoss].count > 0);
  }, [attempts, selectedBoss]);
  /*---- set challenge attempts end ----*/


  // Preload every pic
  useEffect(() => {
    [...imagesRight, ...imagesLeft, 
      ...swordAttackRight, ...swordAttackLeft,
      ...AttackRight, ...AttackLeft,
      ...stickAttackRight, ...stickAttackLeft,
      ...wolfImagesLeft, ...wolfImagesRight,
      ...catImagesLeft, ...catImagesRight].forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Animation
  useEffect(() => {
    let attackAnimationInterval;
    const updateImageForDirection = (dir) => {
      const images = dir === 'right' ? imagesRight : imagesLeft;
      setCurrentImage(images[imageIndex.current % images.length]);
      imageIndex.current++;
    };
    // apply damage to boss
    const applyDamageToBoss = (damageAmount) => {
      setBossHealth((prevHealth) => Math.max(prevHealth - damageAmount, 0));
    };
    const handleKeyDown = (event) => {
      // check if weapon is purchased
      const isSwordAvailable = boughtItems['sword'];
      const isStickAvailable = boughtItems['stick'];
      const isBookAvailable = boughtItems['magicBook'];
  
      switch(event.key) {
        case "0": // Toggle magic attack
          if (isBookAvailable) {
            setIsMagicAttack(!isMagicAttack);
            const magicImage = direction === 'right' ? 'rightMagic.png' : 'leftMagic.png';
            setCurrentImage(magicImage);
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Magic Book to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "9": // Sword attack
          if (isSwordAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0;
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? swordAttackRight : swordAttackLeft;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
                if (imageIndex.current === attackImages.length && isBossInRange()) {
                  clearInterval(attackAnimationInterval);
                  attackAnimationInterval = null;
                  applyDamageToBoss(15); 
                }
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Sword to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "8": // Stick attack
          if (isStickAvailable) {
            if (!attackAnimationInterval) {
              imageIndex.current = 0;
              attackAnimationInterval = setInterval(() => {
                const attackImages = direction === 'right' ? stickAttackRight : stickAttackLeft;
                setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
                imageIndex.current++;
                if (imageIndex.current === attackImages.length && isBossInRange()) {
                  clearInterval(attackAnimationInterval);
                  attackAnimationInterval = null;
                  applyDamageToBoss(10); 
                }
              }, 150);
            }
          } else {
            showCustomPopup("Purchase Required", "You need to purchase the Stick to use this attack.", "rgba(243, 97, 105, 0.7)");
          }
          break;
        case "7": // Normal attack
          if (!attackAnimationInterval) {
            imageIndex.current = 0;
            attackAnimationInterval = setInterval(() => {
              const attackImages = direction === 'right' ? AttackRight : AttackLeft;
              setCurrentImage(attackImages[imageIndex.current % attackImages.length]);
              imageIndex.current++;
              if (imageIndex.current === attackImages.length && isBossInRange()) {
                clearInterval(attackAnimationInterval);
                attackAnimationInterval = null;
                applyDamageToBoss(5); 
              }
            }, 150);
          }
          break;
        case "a":
        case "ArrowLeft":
          setPosition(prevPosition => Math.max(prevPosition - 1, 0));
          setDirection('left');
          if (!attackAnimationInterval) {
            updateImageForDirection('left');
          }
          break;
        case "d":
        case "ArrowRight":
          setPosition(prevPosition => Math.min(prevPosition + 1, 100));
          setDirection('right');
          if (!attackAnimationInterval) {
            updateImageForDirection('right');
          }
          break;
        default:
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      if (["0", "7", "8", "9"].includes(event.key)) {
        const transitionImage = direction === 'right' ? imagesRight[0] : imagesLeft[0];
        setCurrentImage(transitionImage);
      }
      if (isMagicAttack) { 
        const magicImage = direction === 'right' ? 'rightMagic.png' : 'leftMagic.png';
        setCurrentImage(magicImage);
      }
      if (attackAnimationInterval) {
        clearInterval(attackAnimationInterval);
        attackAnimationInterval = null;
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (attackAnimationInterval) {
        clearInterval(attackAnimationInterval);
      }
    };
  }, [direction, boughtItems, isMagicAttack, position, bossHealth]); 
  

  // show use-magic icon with mouse
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Magic attack click
  useEffect(() => {
    const handleMouseClick = (event) => {
      if (!isMagicAttack) return;

      setShowLighting(true);
      const lightingPos = { x: event.clientX, y: event.clientY };
      setLightingPosition(lightingPos);
      lightingAnimationIndex.current = 0;
      setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);

      const intervalId = setInterval(() => {
        lightingAnimationIndex.current += 1;
        if (lightingAnimationIndex.current >= lightingAnimationFrames.length) {
          setShowLighting(false);
          clearInterval(intervalId);
          // check collision
          if (CharacterAttackCollision(lightingPos, bossPosition)) {
            setBossHealth((prevHealth) => Math.max(prevHealth - 20, 0)); 
          }
        } else {
          setCurrentLightingImage(lightingAnimationFrames[lightingAnimationIndex.current]);
        }
      }, 100);

      return () => clearInterval(intervalId);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [isMagicAttack, bossPosition, bossHealth]);

  // Boss Attack Collision detection function
  const BossAttackCollision = (distance) => {
    const collisionThreshold = 10; 
    return Math.abs(distance) <= collisionThreshold;
  };

  // Character Attack collision detection
  const CharacterAttackCollision = (lightingPosition, bossPosition) => {
    const gameArea = document.querySelector('.combat-background');
    if (!gameArea) {
      console.error('Game area not found');
      return false;
    }
    const gameAreaWidth = gameArea.offsetWidth; 
    const gameAreaLeftEdge = gameArea.getBoundingClientRect().left; 
    const lightingPositionPercentage = ((lightingPosition.x - gameAreaLeftEdge) / gameAreaWidth) * 100;
    const collisionThreshold = 10;
    const distance = Math.abs(lightingPositionPercentage - bossPosition); 
    return distance <= collisionThreshold;
  };

  /* ------------- Boss Logic Start ------------ */
    // Boss Logic with game start condition
    useEffect(() => {
      // Only start boss logic if the game has started
      if (!gameStarted) return;
      const moveBoss = () => {
        const selectedBossConfig = bossConfigurations[selectedBoss];
        const distance = bossPosition - position;
        // Use bossSpeed from the configuration
        if (distance < -10) {
          setBossPosition(bossPosition => Math.min(bossPosition + selectedBossConfig.bossSpeed, 100));
          setCurrentBossImage(selectedBossConfig.bossImagesRight[bossImageIndex.current % selectedBossConfig.bossImagesRight.length]);
        } else if (distance > 6) {
          setBossPosition(bossPosition => Math.max(bossPosition - selectedBossConfig.bossSpeed, 0));
          setCurrentBossImage(selectedBossConfig.bossImagesLeft[bossImageIndex.current % selectedBossConfig.bossImagesLeft.length]);
        }
        bossImageIndex.current = (bossImageIndex.current + 1) % selectedBossConfig.bossImagesLeft.length;
        // Set boss attack interval
        if (!bossAttackCooldown && BossAttackCollision(distance)) {
          if (bossHealth > 0) {
            // Use bossAttackPower from the configuration
            setHealth(prevHealth => Math.max(prevHealth - selectedBossConfig.bossAttackPower, 0));
            setBossAttackCooldown(true);
            setTimeout(() => {
              setBossAttackCooldown(false);
            }, bossCooldownTime);
          }
        }      
      };
      const intervalId = setInterval(moveBoss, 80);
      return () => clearInterval(intervalId);
  }, [position, bossPosition, bossAttackCooldown, bossHealth, gameStarted,bossConfigurations, selectedBoss]); 
  /* ------------- Boss Logic End ------------- */

  // Add a state to track if the reward has been given
  const [rewardGiven, setRewardGiven] = useState(false);

  useEffect(() => {
    if (bossHealth === 0 && !rewardGiven && gameStarted) {
      // Assume that you determine the reward based on the boss type here
      const coinsRewarded = selectedBoss === "wolf" ? '50' : '80';
      setReward(coinsRewarded); // Update the reward state with the coinsRewarded value
  
      // Then, call the appropriate reward function based on the boss type
      if (selectedBoss === "wolf") {
        WolfCoinReward();
      } else if (selectedBoss === "cat") {
        CatCoinReward();
      }
        setRewardGiven(true);
    }
  }, [bossHealth, rewardGiven, selectedBoss, WolfCoinReward, CatCoinReward, gameStarted]);
  
  
  const [reward, setReward] = useState('');
  useEffect(() => {
    if (bossHealth <= 0) {
      // Use the reward state to show the dynamic coin amount in the popup
      setShowPopup(true);
      setPopupMessage({
        title: 'Victory!',
        body: `Congratulations, you have defeated the ${selectedBoss} and earned ${reward} coins as your reward!`,
        background_color: 'rgba(0, 255, 0, 0.7)'
      });
      setGameStarted(false);
    }
  }, [bossHealth, selectedBoss, reward]);
  
  

  // check for player's defeat (health reaches 0)
  useEffect(() => {
    if (health <= 0) {
      setGameStarted(false); 
      setShowPopup(true); 
      setPopupMessage({ 
        title: 'Defeat',
        body: 'You have been defeated! No rewards this time. Try again!',
        background_color: 'rgba(243, 97, 105, 0.7)' 
      });
    }
  }, [health]); // Depend on the health state

  // Refresh challenge attempts function
  useEffect(() => {
    const resetAttempts = () => {
      setAttempts({
        wolf: { count: 1, date: new Date().toDateString() },
        cat: { count: 1, date: new Date().toDateString() }
      });
    };
    // calculate the time difference to 8 am
    const now = new Date();
    let tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + (now.getHours() >= 8 ? 1 : 0));
    tomorrow.setHours(8, 0, 0, 0); // set as 8 am
    const msUntilReset = tomorrow - now;
    // refresh challenge attempts 
    const timer = setTimeout(resetAttempts, msUntilReset);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="challenge-page">
      <Popup show={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
      {/* Rest of the game and UI */}
      {!gameStarted ? (
        <>
        <div className="start-screen">
          <h1>Challenge Area</h1>
          <div className="select-boss">
            <button onClick={() => setSelectedBoss("wolf")}>
              {level < 5 ? <img src="lock.png" alt="Locked" style={{marginRight: '5px'}} /> : ""}LEVEL 5  WOLF <img src="wolf-icon.png" alt="" />
            </button>
            <button onClick={() => setSelectedBoss("cat")}>
              {level < 10 ? <img src="lock.png" alt="Locked" style={{marginRight: '5px'}} /> : ""}LEVEL 10  CAT <img src="cat-icon.png" alt="" />
            </button>
          </div>
          
          {/* Display the coins here */}
          <div className="display-coins">
            Reward: {reward} coins
          </div>
          {selectedBoss === "wolf" && (
            <div className="start-button">
              <div className="challenge-info">
                <p>Challenge Attempts {attempts.wolf.count}/1</p>
                <p>Level 5</p>
              </div>
              <button onClick={startChallenge} disabled={!isChallengeAvailable || !isWolfChallengeAvailable}>
                START
              </button>
              <img src="wolfgoleft1.png" alt="" />
              {attempts.wolf.count === 0 && (
                <div className="notice">
                  You have reached your daily challenge limit.<br/> 
                  Please try again tomorrow at 8 am.
                </div>
              )}
              {!isWolfChallengeAvailable && (
                <div className="notice">
                  Reach level 5 to unlock Boss - Wolf.
                </div>
              )}
            </div>
          )}
          {selectedBoss === "cat" && (
            <div className="start-button">
              <div className="challenge-info">
                <p>Challenge Attempts {attempts.cat.count}/1</p>
                <p>Level 10</p>
              </div>
              <button onClick={startChallenge} disabled={!isChallengeAvailable || !isCatChallengeAvailable}>
                START
              </button>
              <img src="catgoleft1.png" alt="" />
              {attempts.cat.count === 0 && (
                <div className="notice">
                  You have reached your daily challenge limit.<br/> 
                  Please try again tomorrow at 8 am.
                </div>
              )}
              {!isCatChallengeAvailable && (
                <div className="notice">
                  Reach level 10 to unlock Boss - Cat.
                </div>
              )}
            </div>
          )}
        </div>
      </>
      ) : (
      // ------- Game content -------- //
      <>
        <Popup show={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} />
        <div className="combat-background">
          {/* Character Health Bar */}
          <div className="combat-health">
            <img src="/heart.png" alt="" />
            <div className="combat-health-bar">
                <div className="combat-health-level" style={{ width: `${health}%` }}></div>
            </div>
            <span>{health}/100</span>
          </div>
          {/* Boss Health Bar */}
          <div className="boss-health">
            <span>{bossHealth}/100</span>
            <div className="boss-health-bar">
              <div className="boss-health-level" style={{ width: `${bossHealth}%` }}></div>
            </div>
            <img src={selectedBoss === "wolf" ? "/wolf-icon.png" : "/cat-icon.png"} alt={selectedBoss} />
          </div>

          {/* Character */}
          <div className="character" style={{ left: `${position}%`, backgroundImage: `url(${currentImage})` }}></div>
          {/* Boss */}
          {bossHealth > 0 &&(
            <div className="boss" style={{ left: `${bossPosition}%`, backgroundImage: `url(${currentBossImage})` }}></div>
          )}
          
          {/* Conditional rendering for the magic icon */}
          {isMagicAttack && (
            <img className="use-magic-icon" src="UseLighting.png" alt="Use Lighting" style={{ position: 'absolute', left: mousePosition.x, top: mousePosition.y, transform: 'translate(-50%, -51%)' }} />
          )}
          {/* Conditional rendering for the lighting animation */}
          {showLighting && (
            <img className="lighting" src={currentLightingImage} alt="Lighting Animation" style={{ position: 'absolute', left: lightingPosition.x, top: lightingPosition.y, transform: 'translate(-50%, -80%)' }} />
          )}
        </div>
        <div className="explain-text">
          <span>Move Left <div className="keyboard-icon">A</div>/<div className="keyboard-icon">{"<"}-</div> Move Right <div className="keyboard-icon">D</div>/<div className="keyboard-icon">-{">"}</div></span>
          <span>Normal Attack <div className="keyboard-icon">7</div> Stick Attack <div className="keyboard-icon">8</div> Sword Attack <div className="keyboard-icon">9</div></span>
          <span>Open Magic State<div className="keyboard-icon">0</div>Magic Attack<div className="keyboard-icon">Mouse Click</div></span>
        </div>
        </>
      )}
    </div>
  );
}
export default ChallengeArea;


