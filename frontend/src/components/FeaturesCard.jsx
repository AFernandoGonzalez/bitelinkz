export const FeatureCard = ({ iconClass, title, description, theme }) => {

    return (
        <div className={`w-full md:w-48 h-[200px] rounded-lg shadow-lg p-2 m-4 flex flex-col justify-around ${theme ? "bg-gray-800" : "bg-white"}`}>
            <i className={`text-3xl ${iconClass}`}></i>
            <p className='text-xl font-semibold'>{title}</p>
            <p className='text-sm'>{description}</p>
        </div>
    );
};