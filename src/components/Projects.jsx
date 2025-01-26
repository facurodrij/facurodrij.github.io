import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import GitHubIcon from "./icons/Github";
import FlaskIcon from "./icons/Flask";
import TailwindIcon from "./icons/Tailwind";
import ReactIcon from "./icons/React";
import AddIcon from "./icons/Add";
import SubtractIcon from "./icons/Subtract";
import DotNetIcon from "./icons/DotNet";
import BootstrapIcon from "./icons/Bootstrap";
import JQueryIcon from "./icons/Jquery";
import DjangoIcon from "./icons/Django";
import SolidityIcon from "./icons/Solidity";
import TruffleIcon from "./icons/Truffle";
import ReadIcon from "./icons/Read";

const LinkButton = ({ href, children }) => {
    return (
        <a
            target="_blank"
            href={href}
            role="link"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 space-x-2 text-base transition bg-gray-100 text-gray-800 border-gray-300 dark:text-white dark:bg-gray-800 border dark:border-gray-600 focus-visible:ring-yellow-500/80 text-md group max-w-fit rounded-xl focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-black hover:bg-gray-900 hover:border-gray-700 hover:text-white dark:hover:bg-gray-100 dark:hover:border-gray-300 dark:hover:text-black"
        >
            {children}
        </a>
    );
};

const TOOLS = {
    TAILWIND: {
        name: "Tailwind CSS",
        className: "text-[#06B6D4] bg-[#051C2B]",
        icon: TailwindIcon
    },
    FLASK: {
        name: "Flask",
        className: "bg-black text-white",
        icon: FlaskIcon
    },
    REACT: {
        name: "React",
        className: "bg-white text-[#61DAFB]",
        icon: ReactIcon
    },
    DOTNET: {
        name: ".NET",
        className: "bg-[#512BD4] text-white",
        icon: DotNetIcon
    },
    BOOTSTRAP: {
        name: "Bootstrap",
        className: "bg-[#7952B3] text-white",
        icon: BootstrapIcon
    },
    JQUERY: {
        name: "jQuery",
        className: "bg-[#0769AD] text-white",
        icon: JQueryIcon
    },
    DJANGO: {
        name: "Django",
        className: "bg-[#092E20] text-white",
        icon: DjangoIcon
    },
    SOLIDITY: {
        name: "Solidity",
        className: "bg-white text-[#363636]",
        icon: SolidityIcon
    },
    TRUFFLE: {
        name: "Truffle",
        className: "bg-white",
        icon: TruffleIcon
    }
}

const PROJECTS = [
    {
        title: "StockCar Gestión - Sistema de facturación y gestión de inventario",
        description:
            "Sistema para Repuestos Stock Car, una empresa dedicada a la venta de repuestos automotores. Actualmente se encuentra en producción dentro de la empresa y en constante actualización.",
        github: "https://github.com/facurodrij/stockcar-gestion",
        image: "/projects/1.webp",
        tools: [TOOLS.FLASK, TOOLS.REACT],
    },
    {
        title: "Tesis de Grado - Blockchain y Smart Contracts aplicado a la rendición de cuentas municipales",
        description:
            "Aplicación web integrando una blockchain de prueba mediante Web3.py y un Smart Contract para garantizar la integridad y confiabilidad de las presentaciones digitales de las rendiciones de cuentas municipales.",
        github: "https://github.com/facurodrij/TrabajoFinal_LSI",
        image: "/projects/2.webp",
        doc: "/projects/Tesis_LSI_Facundo_Rodriguez.pdf",
        tools: [TOOLS.SOLIDITY, TOOLS.TRUFFLE, TOOLS.DJANGO, TOOLS.BOOTSTRAP],
    },
    {
        title: "Sueldos y RRHH - Sistema de gestión de sueldos y recursos humanos",
        description:
            "Aplicación web para la gestión de sueldos y recursos humanos. Parte de la cátedra Recursos Humanos de la Universidad Nacional de Misiones.",
        github: "https://github.com/facurodrij/sueldo-rrhh",
        image: "/projects/3.webp",
        tools: [TOOLS.DOTNET, TOOLS.BOOTSTRAP, TOOLS.JQUERY],
    },
    {
        title: "RESERVÁ - Sistema de gestión de clubes deportivos",
        description:
            "Sistema de gestión de reservas de canchas, manejo de eventos y administración de socios para clubes. Integración con la API de MercadoPago para el cobro de reservas, tickets y membresías.",
        github: "https://github.com/facurodrij/TrabajoFinal_ASC",
        image: "/projects/4.webp",
        tools: [TOOLS.DJANGO, TOOLS.BOOTSTRAP, TOOLS.JQUERY],
    },
]

const Projects = () => {
    const [showAll, setShowAll] = useState(false);
    const visibleProjects = showAll ? PROJECTS : PROJECTS.slice(0, 2);

    return (
        <>
            <div className="flex flex-col gap-y-12 transition duration-500 ease-in-out transform md:gap-y-16">
                {
                    visibleProjects.map(({ image, title, description, tools, link, github, doc }) => (
                        <Transition
                            key={title}
                            show={showAll ? visibleProjects.length == PROJECTS.length : true}
                            appear={showAll ? visibleProjects.length == PROJECTS.length : true}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-300'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <article className="flex flex-col space-x-0 space-y-8 group md:flex-row md:space-x-8 md:space-y-0">
                                <div className="w-full md:w-1/2">
                                    <div className="relative flex flex-col items-center col-span-6 row-span-5 gap-8 transition duration-500 ease-in-out transform shadow-xl overflow-clip rounded-xl sm:rounded-xl md:group-hover:-translate-y-1 md:group-hover:shadow-2xl lg:border lg:border-gray-800 lg:hover:border-gray-700 lg:hover:bg-gray-800/50">
                                        <img alt="" className="object-cover object-top w-full h-56 transition duration-500 sm:h-full md:scale-110 md:group-hover:scale-105" loading="eager" src={image} />
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 md:max-w-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {title}
                                    </h3>
                                    <div className="flex flex-wrap mt-2 w-full">
                                        <ul className="flex flex-wrap gap-x-2 w-full">
                                            {tools.map((tool) => (
                                                <li className="mb-2" key={tool.name}>
                                                    <aside className="inline-flex items-center justify-between px-1 py-1 pr-3 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white">
                                                        <span
                                                            className={`flex items-center gap-x-2 rounded-full text-xs ${tool.className} py-1 px-2`}
                                                        >
                                                            <tool.icon className="size-6" />
                                                        </span>
                                                        <span className="text-sm font-medium px-1">{tool.name}</span>
                                                    </aside>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-2 text-gray-700 dark:text-gray-400">{description}</div>
                                        <footer className="flex items-end justify-start mt-4 gap-x-4">
                                            {github && (
                                                <LinkButton href={github}>
                                                    <GitHubIcon className="size-6" />
                                                    Code
                                                </LinkButton>
                                            )}
                                            {link && (
                                                <LinkButton href={link}>
                                                    <GitHubIcon className="size-6" />
                                                    Preview
                                                </LinkButton>
                                            )}
                                            {doc && (
                                                <LinkButton href={doc}>
                                                    <ReadIcon className="size-6" />
                                                    Leer documento
                                                </LinkButton>
                                            )}
                                        </footer>
                                    </div>
                                </div>
                            </article>
                        </Transition>
                    ))
                }
            </div>
            <div className="flex justify-center mt-8">
                {!showAll ? (
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 space-x-2 text-base uppercase transition text-gray-800 dark:text-gray-400 focus-visible:ring-yellow-500/80 text-md group max-w-fit rounded-md focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-gray-800 active:text-white hover:bg-gray-900 hover:border-gray-700 hover:text-white dark:hover:bg-gray-800 dark:hover:border-gray-300 dark:hover:text-white"
                        onClick={() => setShowAll(true)}
                    >
                        <AddIcon className="size-6" />
                        Ver todos
                    </button>
                ) : (
                    <button
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 space-x-2 text-base uppercase transition text-gray-800 dark:text-gray-400 focus-visible:ring-yellow-500/80 text-md group max-w-fit rounded-md focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-gray-800 active:text-white hover:bg-gray-900 hover:border-gray-700 hover:text-white dark:hover:bg-gray-800 dark:hover:border-gray-300 dark:hover:text-white"
                        onClick={() => setShowAll(false)}
                    >
                        <SubtractIcon className="size-6" />
                        Ver menos
                    </button>
                )}
            </div>
        </>
    );
}

export default Projects;