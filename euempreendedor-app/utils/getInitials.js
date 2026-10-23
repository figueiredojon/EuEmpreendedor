export default function getInitials(nome){
    const partes = nome.trim().split(' ');
    const primeira = partes[0][0];
    const ultima = partes[partes.length - 1][0];

    return `${primeira}${ultima}`.toUpperCase();
}
