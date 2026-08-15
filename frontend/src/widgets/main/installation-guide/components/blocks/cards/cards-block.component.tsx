import { Card, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";

import { getLocalizedText } from "@shared/utils/config-parser";

import { IBlockRendererProps } from "../renderer-block.interface";
import classes from "./cards-block.module.css";

/**
 * Шаги установки. Вместо иконки — номер шага: иконка красива, но не отвечает на
 * вопрос «что делать сначала». Порядок действий человек считывает по цифрам.
 * Отступы и кегль уменьшены, чтобы три шага помещались на экран телефона целиком.
 */
export const CardsBlockRenderer = ({
  blocks,
  isMobile,
  currentLang,
  renderBlockButtons,
}: IBlockRendererProps) => {
  return (
    <Stack gap="xs">
      {blocks.map((block, index) => {
        return (
          <Card
            className={classes.root}
            key={index}
            p={{ base: "sm", sm: "md" }}
            radius="lg"
          >
            <Group align="flex-start" gap="sm" wrap="nowrap">
              <ThemeIcon color="cyan" radius="xl" size={28} variant="light">
                <Text fw={700} size="sm">
                  {index + 1}
                </Text>
              </ThemeIcon>
              <Stack gap="6" style={{ flex: 1, minWidth: 0 }}>
                <Title
                  c="white"
                  fw={600}
                  order={6}
                  style={{ wordBreak: "break-word" }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedText(block.title, currentLang),
                    }}
                  />
                </Title>

                <Text
                  c="dimmed"
                  size={isMobile ? "xs" : "sm"}
                  style={{ whiteSpace: "pre-line", lineHeight: 1.45 }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedText(block.description, currentLang),
                    }}
                  />
                </Text>

                {renderBlockButtons(block.buttons, "light")}
              </Stack>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
};
