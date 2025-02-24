import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Section1 from "../components/section1";




const Landing = () => {
  const containerRef = useRef(null);
  const grayWindowRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial black screen (opacity 1)
    gsap.set(containerRef.current, { backgroundColor: "#b7b7b7" });

    // Animate the gray window emerging from center
    tl.fromTo(
      grayWindowRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    // Animate the image sliding in from the right
    tl.fromTo(
      imageRef.current,
      { x: "100%" },
      { x: "11%", duration: 2, ease: "power3.out" },
      "-=0.8"
    );

    // Animate text appearing with stagger effect
    tl.fromTo(
      textRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.3, duration: 2, ease: "power2.out" },
      "-=1"
    );
  }, []);

  return (
    <>
    <div ref={containerRef} className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
      {/* Gray Window */}
      <div
        ref={grayWindowRef}
        className="absolute w-[90%] h-[80%] bg-gray-800 rounded-3xl shadow-lg  overflow-hidden flex border-4 border-black"
        style={{
          clipPath: "polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%)", // Wavy effect
          borderRadius: "40px",
        }}
      >
        {/* Image covering only 60% of the gray window */}
        <img
          ref={imageRef}
          src="https://media.istockphoto.com/id/1487069717/photo/a-happy-beautiful-woman-texting-on-her-mobile-phone-while-relaxi.jpg?s=612x612&w=0&k=20&c=EpRq7BV73gToNYHsrcw6I3a1elZ3AAnejdhDBxeBOoU="
          alt="Social Engagement"
          className="absolute right-0 w-[60%] h-full object-contain"
        />

        {/* Transparent div with staggered text */}
        <div
          ref={textRef}
          className="absolute top-[50%] left-[8%] transform -translate-y-1/2 text-white text-4xl md:text-6xl font-bold font-[]"
        >
          <p className="mb-4">Track  </p>
          <p className="mb-4">Your Social Life</p>
          <p>Smartly</p>
        </div>
      </div>
    </div>
    <Section1/>
    </>
  );
};

export default Landing;
