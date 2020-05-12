import React from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay/hooks';
import { UserNavQuery } from './__generated__/UserNavQuery.graphql';
import useBoolean from '../../utils/useBoolean';
import { AnimatePresence, motion } from 'framer-motion';
import OutsideClickHandler from 'react-outside-click-handler';
import { Link, useNavigate } from 'react-router-dom';
import { useSignOutMutation } from '../../queries';
import useMediaQuery from '../../utils/useMediaQuery';
import { MEDIA_QUERIES } from '../ui/constants';
import HeaderLink from './HeaderLink';

export default function UserInfo() {
    const navigate = useNavigate();
    const [signOut] = useSignOutMutation();
    const [dropdownOpen, { toggle: dropdownToggle, off: dropdownOff }] = useBoolean(false);
    const mediumOrBigger = useMediaQuery(MEDIA_QUERIES.MEDIUM);

    const data = useLazyLoadQuery<UserNavQuery>(
        graphql`
            query UserNavQuery {
                me {
                    id
                    username
                    name
                }
            }
        `,
        { id: '4' },
    );

    async function handleSignOut() {
        await signOut();
        navigate('/auth/sign-in');
    }

    if (!mediumOrBigger) {
        return (
            <>
                <div className="px-5">
                    <div className="text-base font-medium leading-none text-white">
                        {data.me.name}
                    </div>
                    <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                        {data.me.email}
                    </div>
                </div>
                <div className="mt-3 px-2">
                    <a
                        href="#"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                    >
                        Your Profile
                    </a>
                    <a
                        href="#"
                        className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                    >
                        Settings
                    </a>
                    <a
                        href="#"
                        className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                    >
                        Sign out
                    </a>
                </div>
            </>
        );
    }

    return (
        <OutsideClickHandler onOutsideClick={dropdownOff}>
            <div>
                <HeaderLink onClick={dropdownToggle}>{data.me.name}</HeaderLink>
            </div>
            <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10"
                        // Whenever there's a click inside of the dropdown, we want to close the dropdown.
                        onClick={dropdownOff}
                    >
                        <div className="py-1 rounded-md bg-white shadow-xs">
                            <Link
                                to="/account"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Your Account
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </OutsideClickHandler>
    );
}
