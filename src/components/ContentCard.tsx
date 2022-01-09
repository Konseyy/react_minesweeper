import React, { FC, CSSProperties } from 'react';
interface Props {
   backgroundColor: string;
   fontColor: string;
   title: string;
   annotation: string;
   header?: string;
   footer?: string;
   link?: string;
   isMobile?: boolean;
   imgUrl?: string;
   imgFile?: any;
   style?: CSSProperties;
   imgBordercolor?: string;
   imgBorderWidth?: number;
}
const ContentCard: FC<Props> = ({
   backgroundColor,
   fontColor,
   title,
   annotation,
   link,
   isMobile = false,
   imgUrl,
   imgFile,
   style,
   children,
   header,
   footer,
   imgBordercolor,
   imgBorderWidth,
}) => {
   return (
      <div className={`contentCard ${isMobile ? 'mobile' : ''}`} style={{ ...style, background: backgroundColor }}>
         <a rel="noreferrer" target={'_blank'} href={link} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            <div className={`contentCardInfo ${isMobile ? 'mobile' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
               <h1 style={{ color: fontColor }}>{title}</h1>
               {header && <p style={{ color: fontColor, marginBottom: 15 }}>{header}</p>}
               <p style={{ color: fontColor }}>{annotation}</p>
               {footer && <p style={{ color: fontColor, marginTop: 'auto', marginBottom: 15, marginLeft: 15 }}>{footer}</p>}
            </div>
            {imgUrl || imgFile ? (
               <img
                  className={`contentCardImg ${isMobile ? 'mobile' : ''}`}
                  style={{ borderColor: imgBordercolor ?? '', borderWidth: imgBorderWidth ?? '', boxSizing: 'border-box' }}
                  src={imgFile ? imgFile : imgUrl}
                  alt={title}
               />
            ) : (
               children
            )}
         </a>
      </div>
   );
};

export default ContentCard;
