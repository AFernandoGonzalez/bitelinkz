import React from 'react'

export const HeroSection = ({theme}) => {
    return (
        <div className='h-full flex flex-col justify-center items-center'>
            <h1 className={`text-center text-3xl md:text-6xl font-bold mb-2 ${theme ? '' : 'text-gray-800'}`}>
                Shorten. Share. Simplify.
            </h1>
            <div className='max-w-screen-md mx-auto mt-8 text-center'>
                <p className={`text-xl ${theme ? 'text-white' : ''}`}>
                    Welcome to SnipSnap, where we make URL shortening a breeze. Create concise and branded links effortlessly,
                    track their performance, and simplify your online sharing experience.
                </p>
            </div>
        </div>
    )
}
