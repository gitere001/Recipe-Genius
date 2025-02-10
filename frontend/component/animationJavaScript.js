const cookingImages = [
	"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300&h=300",
	"https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=300&h=300",
	"https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=300&h=300",
	"https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=300&h=300",
	"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300",
  ];

  // Get DOM elements
  const rotatingImage = document.getElementById("rotating-image");
  const progressRing = document.getElementById("progress-ring");
  const bubbleContainer = document.getElementById("bubble-container");

  // Initialize variables
  let currentImageIndex = 0;
  let animationProgress = 0;

  // Set initial image
  rotatingImage.src = cookingImages[currentImageIndex];

  // Image rotation
  setInterval(() => {
	currentImageIndex = (currentImageIndex + 1) % cookingImages.length;
	rotatingImage.src = cookingImages[currentImageIndex];
  }, 2000);

  // Progress ring animation
  const progressInterval = setInterval(() => {
	animationProgress += 2;
	progressRing.style.clipPath = `polygon(50% 50%, -50% -50%, ${animationProgress}% -50%, ${animationProgress}% ${animationProgress}%, -50% ${animationProgress}%)`;

	if (animationProgress >= 100) {
	  clearInterval(progressInterval);
	}
  }, 100);

  // Create bubbles
  function createBubble() {
	const bubble = document.createElement("div");
	bubble.className = "bubble";

	// Random properties
	const left = Math.random() * 100;
	const size = Math.random() * 16 + 8;
	const animationDuration = Math.random() * 2 + 2;
	const animationDelay = Math.random() * 2;

	// Apply styles
	bubble.style.left = `${left}%`;
	bubble.style.width = `${size * 1.5}px`;
	bubble.style.height = `${size * 0.6}px`;
	bubble.style.borderRadius = "50% / 25%";
	bubble.style.animation = `bubble ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
	// Remove bubble after animation
	bubble.addEventListener("animationend", () => {
	  bubble.remove();
	});

	bubbleContainer.appendChild(bubble);
  }

  // Create initial bubbles
  for (let i = 0; i < 15; i++) {
	createBubble();
  }