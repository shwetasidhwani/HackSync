import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

const Section1 = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const cardContents = [
    { title: "Cognitive Engagement", text: "Overloaded with work? Relieve some stress ", link: "/cognition" },
    { title: "AI Counselor", text: "Need to talk to someone? Feel free to do so", link: "/counselor" },
    { title: "Calendar", text: "This is the content for Calendar.", link: "/calendar" },
    { title: "Social Network", text: "This is the content for Social Network.", link: "/socialnetwork" },
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.set(cardsRef.current, { opacity: 0, scale: 0.5 })
      .to(cardsRef.current, { opacity: 1, scale: 1, duration: 3 })
      .to(cardsRef.current, { rotation: 720, duration: 2 })
      .to(cardsRef.current[0], { top: "17%", left: "50%", duration: 1 }, "move")
      .to(cardsRef.current[1], { top: "83%", left: "50%", duration: 1 }, "move")
      .to(cardsRef.current[2], { top: "50%", left: "24%", duration: 1 }, "move")
      .to(cardsRef.current[3], { top: "50%", left: "76%", duration: 1 }, "move")
      .to(cardsRef.current[4], {
        width: "550px",
        height: "200px",
        backgroundImage: "url('https://www.naylor.com/associationadviser/wp-content/uploads/sites/2/2016/09/People-Texting-620-x-330.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        duration: 1,
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen flex items-center justify-center bg-[#b7b7b7]"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="absolute w-60 h-60 text-center bg-gray-800 flex flex-col items-center justify-center text-white shadow-lg p-4 rounded-2xl"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          {index < 4 ? (
            <>
              <p className="text-lg font-semibold">{cardContents[index].title}</p>
              <p className="text-sm mt-2">{cardContents[index].text}</p>
              <Link to={cardContents[index].link}>
                <button className="mt-8 px-4 py-2 bg-[#333333] text-[#ffff] rounded border-2 border-[#a9a9a9] hover:bg-[#474747]">
                  Explore
                </button>
              </Link>
            </>
          ) : (
            <p className="text-2xl font-bold">Our Implementations</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Section1;
