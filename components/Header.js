import { FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";
import styles from '../styles/Home.module.css';

export default function Header() {

    return (
        <div className="navbar text-neutral-content bg-primary-content">
            <div className="flex-1 ml-3 text-gray-50">
                <ul className='flex flex-row justify-between gap-6'>
                    <li><a className="" href="#">Dashboard</a></li>
                    <li><a className={styles.leftToRight} href="https://twitter.com/coffiasd"><FaTwitter size="1rem" className='m-0.5' />TWITTER</a></li>
                    <li><a className={styles.leftToRight} href="https://github.com/coffiasd"><FaGithub size="1rem" className='m-0.5' />GITHUB</a></li>
                    <li><a className={styles.leftToRight} href="#"><FaYoutube size="1rem" className='m-0.5' />YOUTUBE</a></li>
                </ul>
            </div>
        </div >
    )
}