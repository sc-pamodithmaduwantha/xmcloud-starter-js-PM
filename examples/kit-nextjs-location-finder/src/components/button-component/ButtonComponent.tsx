/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import { Default as Icon } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';
import { Link, LinkField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Button } from '@/components/ui/button';
import { EnumValues } from '@/enumerations/generic.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';
/**
 * Model used for Sitecore Component integration
 */

export type ButtonFields = {
  fields: {
    buttonLink: LinkField;
    icon?: { value: EnumValues<typeof IconName> };
    iconClassName?: string;
    isAriaHidden?: boolean;
  };
  variant?: EnumValues<typeof ButtonVariants>;
  params: {
    size?: EnumValues<typeof ButtonSize>;
    iconPosition?: EnumValues<typeof IconPosition>;
    iconClassName?: string;
    isPageEditing?: boolean;
  };
  page?: { mode?: { isEditing?: boolean } };
};

export type ButtonRendering = { rendering: ComponentRendering };
const linkIsValid = (link: LinkField) => {
  return (
    !!link?.value?.text &&
    (!!link?.value?.href || !!link?.value?.url) &&
    link?.value?.href !== 'http://'
  );
};
const isValidEditableLink = (link: LinkField, icon?: ImageField) => {
  return (
    !!link?.value?.text ||
    (icon?.value?.src &&
      (!!link?.value?.href || !!link?.value?.url) &&
      link?.value?.href !== 'http://')
  );
};

export type ButtonComponentProps = ComponentProps & ButtonFields;
const ButtonBase = (
  props: ButtonFields['params'] &
    ButtonFields['fields'] & { variant?: EnumValues<typeof ButtonVariants> } & {
      className?: string;
    }
): JSX.Element | null => {
  const {
    buttonLink,
    icon,
    variant,
    size,
    iconPosition = 'trailing',
    iconClassName,
    isAriaHidden = true,
    className = '',
    isPageEditing,
  } = props || {};
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  const iconName = icon?.value as EnumValues<typeof IconName>;
  if (!isPageEditing && !linkIsValid(buttonLink)) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isPageEditing ? (
        <Link field={buttonLink} editable={true} />
      ) : (
        <Link field={buttonLink} editable={isPageEditing}>
          {iconPosition === IconPosition.LEADING && icon ? (
            <Icon
              iconName={iconName ? iconName : IconName.ARROW_LEFT}
              className={iconClassName}
              isAriaHidden={ariaHidden}
            />
          ) : null}
          {buttonLink?.value?.text}
          {iconPosition !== IconPosition.LEADING && icon ? (
            <Icon
              iconName={iconName ? iconName : IconName.ARROW_LEFT}
              className={iconClassName}
              isAriaHidden={ariaHidden}
            />
          ) : null}
        </Link>
      )}
    </Button>
  );
};

const EditableButton = (props: {
  buttonLink: LinkField;
  icon?: ImageField;
  iconClassName?: string;
  iconPosition?: EnumValues<typeof IconPosition>;
  isAriaHidden?: boolean;
  variant?: EnumValues<typeof ButtonVariants>;
  className?: string;
  isPageEditing?: boolean;
  size?: EnumValues<typeof ButtonSize>;
  //if asIconLink is set the text will not show up in the link but as an aria label
  asIconLink?: boolean;
  [key: string]: any;
}): JSX.Element | null => {
  const {
    buttonLink,
    icon,
    variant,
    size,
    iconPosition = 'trailing',
    iconClassName = 'h-6 w-6 object-contain',
    isAriaHidden = true,
    className,
    isPageEditing = false,
    asIconLink = false,
  } = props || {};
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  if (!isPageEditing && !isValidEditableLink(buttonLink, icon)) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isPageEditing ? (
        <span className="flex">
          {iconPosition === IconPosition.LEADING ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
          <Link field={buttonLink} editable={isPageEditing} />
          {iconPosition !== IconPosition.LEADING ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
        </span>
      ) : (
        <Link
          className={className}
          field={buttonLink}
          editable={isPageEditing}
          aria-label={asIconLink ? buttonLink?.value?.text : undefined}
        >
          {iconPosition === IconPosition.LEADING && icon?.value?.src ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
          {!asIconLink && buttonLink?.value?.text}
          {iconPosition !== IconPosition.LEADING && icon?.value?.src ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
        </Link>
      )}
    </Button>
  );
};

const Default = (props: ButtonComponentProps): JSX.Element | null => {
  console.log('=== ButtonComponent Default - Start ===');
  const { fields, params, page } = props;
  const { buttonLink, icon, isAriaHidden = true } = fields || {};
  const { size, iconPosition = 'trailing', iconClassName, isPageEditing } = params || {};
  const variant = props?.variant || ButtonVariants.DEFAULT;
  console.log('Button variant:', variant);
  console.log('Icon from fields:', icon);
  console.log('Icon value:', icon?.value);
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  const iconName = icon?.value as EnumValues<typeof IconName>;
  const isEditing = isPageEditing || page?.mode?.isEditing;
  console.log('isEditing:', isEditing);
  if (!isEditing && !linkIsValid(buttonLink)) return null;

  // Only set a button icon if one is explicitly provided
  const buttonIcon: EnumValues<typeof IconName> | undefined =
    iconName ||
    (buttonLink?.value?.linktype as EnumValues<typeof IconName>) ||
    undefined;

  // Determine if we should show an icon
  const shouldShowIcon = !!buttonIcon;
  console.log('buttonIcon:', buttonIcon);
  console.log('shouldShowIcon:', shouldShowIcon);
  console.log('iconPosition:', iconPosition);

  if (fields) {
    console.log('Rendering button with fields');
    return (
      <Button asChild variant={variant} size={size}>
        {isEditing ? (
          <>
            {console.log('=== EDITING MODE PATH ===')}
            <span className="flex items-center gap-2">
              {iconPosition === IconPosition.LEADING && shouldShowIcon && (
                <>
                  {console.log('Rendering LEADING icon in editing mode')}
                  <Icon iconName={buttonIcon!} className={iconClassName} isAriaHidden={ariaHidden} />
                </>
              )}
              <Link field={buttonLink} editable={true} />
              {iconPosition !== IconPosition.LEADING && shouldShowIcon && (
                <>
                  {console.log('Rendering TRAILING icon in editing mode')}
                  <Icon iconName={buttonIcon!} className={iconClassName} isAriaHidden={ariaHidden} />
                </>
              )}
            </span>
          </>
        ) : (
          <>
            {console.log('=== NORMAL MODE PATH ===')}
            <Link editable={isEditing} field={buttonLink}>
              {iconPosition === IconPosition.LEADING && shouldShowIcon && (
                <>
                  {console.log('Rendering LEADING icon in normal mode')}
                  <Icon iconName={buttonIcon!} className={iconClassName} isAriaHidden={ariaHidden} />
                </>
              )}
              {buttonLink?.value?.text}
              {iconPosition !== IconPosition.LEADING && shouldShowIcon && (
                <>
                  {console.log('Rendering TRAILING icon in normal mode')}
                  <Icon iconName={buttonIcon!} className={iconClassName} isAriaHidden={ariaHidden} />
                </>
              )}
            </Link>
          </>
        )}
      </Button>
    );
  }

  return <NoDataFallback componentName="Button" />;
};

const Primary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.PRIMARY} />;
};

const Destructive = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.DESTRUCTIVE} />;
};

const Ghost = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.GHOST} />;
};

const LinkButton = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.LINK} />;
};

const Outline = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.OUTLINE} />;
};

const Secondary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.SECONDARY} />;
};

const Tertiary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.TERTIARY} />;
};

export {
  Default,
  ButtonBase,
  EditableButton,
  Primary,
  Destructive,
  Ghost,
  LinkButton,
  Outline,
  Secondary,
  Tertiary,
};
