import React from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import ProfilePage from './ProfilePage.jsx';
import {getProfile, updateProfile} from '../../api/profile.js';
import {getReminders, getModulesShort} from '../../api/reminders.js';
import {removeTokens} from '../../utils/tokenStorage.js';
import {PROFILE_TABS} from '../../constants/profileConstants.js';

vi.mock('../../api/profile.js', () => ({
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
}));

vi.mock('../../api/auth.js', () => ({
    sendVerificationCode: vi.fn(),
    verifyEmail: vi.fn(),
}));

vi.mock('../../api/reminders.js', () => ({
    getReminders: vi.fn(),
    createReminders: vi.fn(),
    updateReminders: vi.fn(),
    deleteReminders: vi.fn(),
    getModulesShort: vi.fn(),
}));

vi.mock('../../utils/tokenStorage.js', async (importOriginal) => ({
    ...(await importOriginal()),
    removeTokens: vi.fn(),
}));

const profileResponse = {
    user: {username: 'Вероника', email: 'test@example.com', photoURL: null},
    stats: {testsCompleted: 12, currentStreak: 3, avgScore: 75},
    activity: [{date: '2026-05-31', count: 2}],
    recentAttempts: [
        {testId: 1, testName: 'React test', date: '2026-05-31T10:00:00Z', score: 3, total: 5},
    ],
};

const renderProfile = (entry = '/profile') => render(
    <MemoryRouter initialEntries={['/', entry]} initialIndex={1}>
        <Routes>
            <Route path="/" element={<div>Главная</div>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/login" element={<div>Страница входа</div>}/>
        </Routes>
    </MemoryRouter>
);

const renderLoaded = async ({entry, profile = profileResponse} = {}) => {
    getProfile.mockResolvedValueOnce(profile);
    renderProfile(entry);
    await screen.findByRole('heading', {name: 'Вероника'});
};

const statCard = (label) => within(screen.getByText(label).parentElement);

const silenceConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => {
});

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        getReminders.mockResolvedValue([]);
        getModulesShort.mockResolvedValue([]);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('loading profile', () => {
        it('shows loading state', () => {
            getProfile.mockReturnValueOnce(new Promise(() => {
            }));
            renderProfile();

            expect(screen.getByText('Загрузка...')).toBeInTheDocument();
            expect(screen.getByText('Личный кабинет')).toBeInTheDocument();
        });

        it('shows error when profile request fails', async () => {
            silenceConsoleError();
            getProfile.mockRejectedValueOnce(new Error('fail'));

            renderProfile();

            expect(await screen.findByText('Не удалось загрузить данные профиля')).toBeInTheDocument();
            expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Статистика'})).not.toBeInTheDocument();
        });

        it('renders user card, stats, activity and recent attempts', async () => {
            await renderLoaded();

            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('В')).toBeInTheDocument();

            expect(statCard('Тестов пройдено').getByText('12')).toBeInTheDocument();
            expect(statCard('Дней подряд').getByText('3')).toBeInTheDocument();
            expect(statCard('Средний результат').getByText('75%')).toBeInTheDocument();

            expect(screen.getByText('Активность прохождений')).toBeInTheDocument();
            expect(screen.getByText('Последние попытки')).toBeInTheDocument();
            expect(screen.getByText('React test')).toBeInTheDocument();
            expect(screen.getByText('3/5')).toBeInTheDocument();
            expect(screen.getByText('60%')).toBeInTheDocument();
            expect(getProfile).toHaveBeenCalledTimes(1);
        });

        it('shows empty message when there are no recent attempts', async () => {
            await renderLoaded({profile: {...profileResponse, recentAttempts: []}});

            expect(screen.getByText('Вы пока не проходили тесты')).toBeInTheDocument();
        });
    });

    describe('tabs', () => {
        it('opens stats tab by default and does not load reminders', async () => {
            await renderLoaded();

            expect(screen.getByText('Последние попытки')).toBeInTheDocument();
            expect(screen.queryByText('Активные напоминания')).not.toBeInTheDocument();
            expect(getReminders).not.toHaveBeenCalled();
        });

        it('switches to reminders and back to stats', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: 'Уведомления'}));

            expect(await screen.findByText('Нет активных напоминаний')).toBeInTheDocument();
            expect(screen.queryByText('Последние попытки')).not.toBeInTheDocument();
            expect(getReminders).toHaveBeenCalledTimes(1);

            await user.click(screen.getByRole('button', {name: 'Статистика'}));
            expect(screen.getByText('Последние попытки')).toBeInTheDocument();
            expect(screen.queryByText('Активные напоминания')).not.toBeInTheDocument();
        });

        it('opens reminders tab from navigation state', async () => {
            getProfile.mockResolvedValueOnce(profileResponse);
            renderProfile({pathname: '/profile', state: {tab: PROFILE_TABS.REMINDERS}});

            expect(await screen.findByText('Активные напоминания')).toBeInTheDocument();
            expect(screen.queryByText('Последние попытки')).not.toBeInTheDocument();
        });
    });

    describe('profile actions', () => {
        it('edits name and shows updated name with toast', async () => {
            const user = userEvent.setup();
            updateProfile.mockResolvedValueOnce({});
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: 'Редактировать профиль'}));
            expect(screen.getByText('Редактировать профиль', {selector: 'h2'})).toBeInTheDocument();

            const nameInput = screen.getByPlaceholderText('Имя');
            await user.clear(nameInput);
            await user.type(nameInput, 'Анна Смирнова');
            await user.click(screen.getByRole('button', {name: 'Сохранить изменения'}));

            await waitFor(() => {
                expect(updateProfile).toHaveBeenCalledWith({
                    username: 'Анна Смирнова',
                    email: 'test@example.com',
                });
            });

            expect(await screen.findByRole('heading', {name: 'Анна Смирнова'})).toBeInTheDocument();
            expect(screen.getByText('АС')).toBeInTheDocument();
            expect(screen.getByText('Профиль успешно обновлён')).toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Имя')).not.toBeInTheDocument();
            expect(getProfile).toHaveBeenCalledTimes(1);
        });

        it('closes edit modal on cancel without saving', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: 'Редактировать профиль'}));
            await user.click(screen.getByRole('button', {name: 'Отмена'}));

            expect(screen.queryByPlaceholderText('Имя')).not.toBeInTheDocument();
            expect(updateProfile).not.toHaveBeenCalled();
        });

        it('logs out and goes to login page', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: 'Выйти из аккаунта'}));

            expect(removeTokens).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Страница входа')).toBeInTheDocument();
        });

        it('goes back by header arrow', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByAltText('Назад'));

            expect(screen.getByText('Главная')).toBeInTheDocument();
        });
    });
});
