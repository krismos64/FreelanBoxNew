import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";
import { Modal } from "@/components/ui/Modal";
import welcomeAnimation from "@/animations/welcome.json";
import playButtonAnimation from "@/animations/play-button.json";
import { Button } from "@/components/ui/Button";
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: DocumentTextIcon,
      title: "Devis & Factures",
      description:
        "Créez et gérez vos documents professionnels en quelques clics",
    },
    {
      icon: UserGroupIcon,
      title: "Gestion Clients",
      description: "Centralisez vos contacts et suivez vos relations clients",
    },
    {
      icon: CalendarIcon,
      title: "Planning Intégré",
      description: "Organisez votre temps et vos rendez-vous efficacement",
    },
    {
      icon: ChartBarIcon,
      title: "Statistiques",
      description: "Suivez vos performances et votre croissance",
    },
    {
      icon: CheckCircleIcon,
      title: "Checklist",
      description: "Gardez le contrôle de vos tâches quotidiennes",
    },
  ];

  return (
    <div className="min-h-screen font-['SF Pro Display']">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-primary-600 via-secondary-500 to-primary-500 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <Lottie
                animationData={welcomeAnimation}
                className="w-64 h-64 md:w-72 md:h-72"
              />
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Bienvenue sur FreelanceBox
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                La solution tout-en-un pour gérer votre activité de freelance
                avec simplicité et professionnalisme.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="text-lg px-8 py-4 bg-white text-primary-600 hover:bg-white/90 hover:scale-105 transform transition-all duration-300 shadow-xl"
              >
                Commencer maintenant
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>

      {/* Video Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Découvrez notre vidéo de présentation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Regardez comment FreelanceBox peut vous aider à gérer votre
              activité
            </p>
          </motion.div>

          {/* Animation Lottie en tant que bouton */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div
              className="cursor-pointer w-48 h-48 hover:scale-105 transition-transform duration-300"
              onClick={() => setShowVideo(true)}
            >
              <Lottie
                animationData={playButtonAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={ref} className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        title="Présentation de FreelanceBox"
      >
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VOTRE_VIDEO_ID?autoplay=1"
            title="Présentation de FreelanceBox"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} FreelanceBox. Tous droits réservés.
            Chrsitophe Mostefaoui.
          </p>
        </div>
      </footer>
    </div>
  );
};
