"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaFacebook, FaTwitter, FaInstagram, FaGooglePlay, FaLeaf, FaSearch, FaUserGraduate } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { PiPlantFill } from "react-icons/pi";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className='overflow-x-hidden'>
      <div className="relative w-screen h-screen">
        <Image
          src="/images/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex flex-wrap justify-center items-center" data-aos="fade-up">
            Welcome to&nbsp;
            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
              BotaniPal 
              <PiPlantFill className="text-green-300 text-4xl ml-2" />
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white mb-1" data-aos="fade-up" data-aos-delay="200">Your On-the-Go Guide to Understanding</p>
          <p className="text-lg md:text-2xl text-white mb-2" data-aos="fade-up" data-aos-delay="200">and Caring for Your Plants</p>
          <p className="text-sm md:text-xl text-gray-300" data-aos="fade-up" data-aos-delay="200">Discover plant type and disease information to</p>
          <p className="text-sm md:text-xl text-gray-300 mb-4" data-aos="fade-up" data-aos-delay="200">effortlessly care for your plants</p>
          <button
            className="flex items-center px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-green-400 hover:to-blue-500 text-white text-bold rounded-lg shadow-md transition duration-300"
            data-aos="fade-up" data-aos-delay="400">
            Coming Soon <span className="ml-2"><FaGooglePlay /></span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-20 bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
          <div className="w-full md:w-1/2 pr-0 md:pr-4">
            <Image
              src="/images/Container.png"
              alt="Plant Disease Detection"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-4 flex flex-col justify-center">
            <h2 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About&nbsp;
              <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent flex items-center">
                BotaniPal
                <PiPlantFill className="text-green-600 text-4xl ml-2" />
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">
              BotaniPal makes it easy for you to take the next steps in caring for your plants. Our platform connects you with Botany’s experts and offers a one-stop solution for all your sustainability needs. Whether it's detecting plant types and their information, preventing and treating plant diseases, looking at plant price trends, or just discussing with others to find various solutions to problems, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full py-36 md:py-72">
        <Image
          src="/images/background2.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white py-5 mb-3" data-aos="fade-up" data-aos-delay="200">
            Why <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent underline">BotaniPal</span>?
          </h1>
          <div className="w-4/5 h-1 bg-gray-400 mx-auto mb-6"></div>
          <div className="relative" data-aos="fade-left" data-aos-delay="400">
            <Image
              src="/images/Container2.png"
              alt="Plant Disease Detection"
              width={800}
              height={500}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-11 bg-white" data-aos="fade-up">
        <h2 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 mt-5 text-center">We Provide All-In-One Plant Care Options on 1 Platform</h2>
        <p className="text-sm md:text-base text-gray-500 mb-1 text-center">Discover plant care options in a single hub. Simplify your effort to understanding and caring for your plant, then make them alive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 py-11 bg-white">
        <div className="flex items-start" data-aos="fade-left" data-aos-delay="200">
          <FaSearch className="text-green-600 text-6xl md:text-7xl mr-4 md:mr-10" />
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Detecting Plant Type and Plant Disease</h3>
            <p className="text-sm md:text-base text-gray-700">Recognize and inspect anything happening to your plant. If something seems off, try scanning it and provide first aid.</p>
          </div>
        </div>

        <div className="flex items-start" data-aos="fade-left" data-aos-delay="400">
          <FaUserGraduate className="text-green-600 text-6xl md:text-7xl mr-4 md:mr-10" />
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Crops Price Prediction</h3>
            <p className="text-sm md:text-base text-gray-700">Your healthy and well-maintained plants can actually generate income. Discover the best times to sell your plants at high prices!</p>
          </div>
        </div>

        <div className="flex items-start" data-aos="fade-left" data-aos-delay="600">
          <RiMoneyDollarCircleFill className="text-green-600 text-6xl md:text-7xl mr-4 md:mr-10" />
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Price Forecasting</h3>
            <p className="text-sm md:text-base text-gray-700">Accurate forecasting of commodity prices for better market decisions.</p>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="flex flex-col items-center w-full pt-11 mt-12 bg-gray-100" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-black mt-1">Our Features 🔥</h2>
        <p className="text-sm md:text-base font-bold text-black mb-1 text-center">Our application features are designed to save you time and provide the best user experience.</p>
        <div className="w-4/5 h-px bg-black mx-auto mb-2"></div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-20 bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
          <div className="w-full md:w-1/2 pr-0 md:pr-4">
            <Image
              src="/images/phone1.png"
              alt="Plant Disease Detection"
              width={300}
              height={150}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-4 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Plant Type Detection 📷</h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">Know what's growing! BotaniPal's built-in identifier uses your camera to instantly recognize plants, helping you care for them perfectly.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-20 bg-gray-200">
        <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
          <div className="w-full md:w-1/2 pr-0 md:pr-4 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Plant Disease Detection 💀</h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">Spot diseases early with BotaniPal's Disease Detection. Take a picture and get treatment recommendations to keep your greenery healthy.</p>
          </div>
          <div className="w-full md:w-1/2 px-0 md:px-16 ml-0 md:ml-9">
            <Image
              src="/images/phone2.png"
              alt="Plant Disease Detection"
              width={300}
              height={150}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-20 bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
          <div className="w-full md:w-1/2 pr-0 md:pr-4">
            <Image
              src="/images/phone3.png"
              alt="Plant Disease Detection"
              width={300}
              height={150}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-4 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Consultation with The Experts 👩🏻‍🎓</h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">Stuck with a tricky plant problem? BotaniPal connects you with gardening gurus! Get personalized advice from real experts for a flourishing garden.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 md:px-8 py-20 bg-gray-200">
        <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
          <div className="w-full md:w-1/2 pr-0 md:pr-4 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Planting Solutions on Forums 💬</h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">Stuck in a planting rut? BotaniPal's Plant Forums connect you with a community of passionate gardeners! Share problems, swap tips, and discover expert solutions together.</p>
          </div>
          <div className="w-full md:w-1/2 px-0 md:px-16 ml-0 md:ml-9">
            <Image
              src="/images/phone2.png"
              alt="Plant Disease Detection"
              width={300}
              height={150}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full py-20 md:py-36">
        <Image
          src="/images/background2.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex flex-col md:flex-row w-full max-w-5xl" data-aos="fade-right">
            <div className="w-full md:w-1/2 px-6">
              <Image
                src="/images/forest.jpg"
                alt="Plant Disease Detection"
                width={400}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-1/2 pl-4 flex flex-col justify-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Increase Your Knowledge About Your Plants Now 👊
              </h2>
              <p className="text-sm md:text-lg text-white mb-6">Try BotaniPal to grow, take care, and sell your commodity to the market!</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center flex-col md:flex-row text-center md:text-left">
            <div className="text-sm mb-4 md:mb-0">
              <p>&copy; 2024 BotaniPal. All rights reserved.</p>
              <p>Privacy Policy | Terms of Service</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-gray-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 hover:text-gray-400">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
