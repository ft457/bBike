import Hero from "../Components/Index/Hero/hero";
import Bikes from "../Components/Index/Bikes/bikes";
import Features from "../Components/Index/Features/features";
import Feedback from "../Components/Index/Feedback/feedback";
import Contact from "../Components/Index/Contact/contact";

const Index = props => {

    return(
        <div className='withWidth'>
            <Hero />
            <Bikes />
            <Features />
            <Feedback />
            <Contact />
        </div>
    )
}

export default Index;