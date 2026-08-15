import {
    IconBrandDiscord,
    IconBrandTelegram,
    IconBrandVk,
    IconCopy,
    IconMessageChatbot,
    IconQrcode
} from '@tabler/icons-react'
import { ActionIcon, Button, Group, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useCurrentLang } from '@entities/app-config-store'
import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-link.module.css'

interface IProps {
    hideGetLink: boolean
    supportUrl: string
    /** Показать как отдельную подписанную кнопку, а не как иконку в шапке.
     *  Иконка в шапке непонятна: люди не догадываются, что за ней QR-код. */
    variant?: 'button' | 'icon'
}

/** Подпись кнопки. В базовых переводах страницы нет строки «Показать QR»
 *  (там «Получить ссылку»), а добавлять свой ключ в конфиг — значит тянуть
 *  правку ещё и в панель. Двух языков здесь достаточно. */
const QR_LABEL: Record<string, string> = {
    ru: 'Показать QR',
    en: 'Show QR'
}

export const SubscriptionLinkWidget = ({ supportUrl, hideGetLink, variant = 'icon' }: IProps) => {
    const { t, baseTranslations } = useTranslation()
    const subscription = useSubscription()
    const clipboard = useClipboard({ timeout: 10000 })
    const currentLang = useCurrentLang()

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopy = () => {
        notifications.show({
            title: t(baseTranslations.linkCopied),
            message: t(baseTranslations.linkCopiedToClipboard),
            color: 'cyan'
        })
        clipboard.copy(subscriptionUrl)
    }

    const renderSupportLink = (supportUrl: string) => {
        const iconConfig = {
            't.me': { icon: IconBrandTelegram, color: '#0088cc' },
            'discord.com': { icon: IconBrandDiscord, color: '#5865F2' },
            'vk.com': { icon: IconBrandVk, color: '#0077FF' }
        }

        const matchedPlatform = Object.entries(iconConfig).find(([domain]) =>
            supportUrl.includes(domain)
        )

        const { icon: Icon, color } = matchedPlatform
            ? matchedPlatform[1]
            : { icon: IconMessageChatbot, color: 'cyan' }

        return (
            <ActionIcon
                c={color}
                component="a"
                href={supportUrl}
                radius="md"
                rel="noopener noreferrer"
                size="xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                target="_blank"
                variant="default"
            >
                <Icon />
            </ActionIcon>
        )
    }

    const handleGetLink = () => {
        vibrate('tap')

        const subscriptionQrCode = renderSVG(subscriptionUrl, {
            whiteColor: '#161B22',
            blackColor: '#22d3ee'
        })

        modals.open({
            centered: true,
            title: t(baseTranslations.getLink),
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle
            },
            children: (
                <Stack align="center">
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text c="white" fw={600} size="lg" ta="center">
                        {t(baseTranslations.scanQrCode)}
                    </Text>
                    <Text c="dimmed" size="sm" ta="center">
                        {t(baseTranslations.scanQrCodeDescription)}
                    </Text>

                    <Button
                        fullWidth
                        leftSection={<IconCopy />}
                        onClick={handleCopy}
                        radius="md"
                        variant="light"
                    >
                        {t(baseTranslations.copyLink)}
                    </Button>
                </Stack>
            )
        })
    }

    if (variant === 'button') {
        if (hideGetLink) return null

        return (
            <Button
                fullWidth
                leftSection={<IconQrcode size={20} />}
                onClick={handleGetLink}
                radius="md"
                size="md"
                variant="filled"
            >
                {QR_LABEL[currentLang] ?? QR_LABEL.en}
            </Button>
        )
    }

    return (
        <Group gap="xs" ml="auto" wrap="nowrap">
            {!hideGetLink && (
                <ActionIcon
                    className={classes.actionIcon}
                    onClick={handleGetLink}
                    radius="md"
                    size="xl"
                    variant="default"
                >
                    <IconQrcode />
                </ActionIcon>
            )}

            {supportUrl !== '' && renderSupportLink(supportUrl)}
        </Group>
    )
}
